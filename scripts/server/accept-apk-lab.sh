#!/bin/bash
# Réception du dataset APK sur le serveur de déploiement.
#
# Ce script est la *commande forcée* de la clé SSH qui dépose le dataset. Il n'est pas
# appelé par le build du site : il tourne à la place d'un shell, ce qui est toute sa
# raison d'être. La clé qui l'ouvre est détenue par la CI d'un dépôt privé ; une fuite de
# ce secret doit donner « dépose une archive dans un répertoire », pas un shell sur la
# machine qui sert unlock-my-data.com.
#
#   command="/srv/umd-private/bin/accept-apk-lab",restrict,no-pty ssh-ed25519 AAAA... apk-lab-ci
#
# Deux verbes, passés par le client et lus dans SSH_ORIGINAL_COMMAND :
#
#   manifest   écrit le manifeste en place sur stdout, ou `{}` s'il n'y en a pas.
#              Sert la porte d'idempotence : la CI compare, et ne dépose rien si le
#              dataset qu'elle vient de produire est déjà celui qui est servi.
#   accept     lit une archive tar.gz sur stdin, la déballe, la contrôle, et l'échange
#              avec le dataset en place.
#
# La vérification des empreintes n'est *pas* ici : elle est dans
# `scripts/load-apk-lab.mjs`, côté build, où elle est testée et où elle peut refuser le
# lot entier. Ce script contrôle la structure — un manifeste lisible, dont chaque fichier
# annoncé existe — et rien de plus. Deux contrôles à deux endroits qui ne partagent pas
# de code : si l'un se trompe, l'autre le dit.
set -euo pipefail

ROOT="${APK_LAB_ROOT:-/srv/umd-private}"
LIVE="$ROOT/apk-lab"
NEXT="$ROOT/apk-lab.next"
PREV="$ROOT/apk-lab.prev"

log() { printf '%s\n' "$*" >&2; }
die() { log "erreur : $*"; exit 1; }

case "${SSH_ORIGINAL_COMMAND:-accept}" in
  manifest)
    cat "$LIVE/manifest.json" 2>/dev/null || echo '{}'
    exit 0
    ;;
  accept) ;;
  *) die "verbe inconnu : ${SSH_ORIGINAL_COMMAND}. Attendu : manifest | accept" ;;
esac

rm -rf "$NEXT"
mkdir -p "$NEXT"
# `--no-same-owner` et le déballage dans un répertoire neuf : l'archive vient du réseau,
# elle n'a pas à choisir les propriétaires ni à écrire ailleurs que sous $NEXT.
tar -xz --no-same-owner -C "$NEXT" || die "archive illisible"

[ -f "$NEXT/manifest.json" ] || die "archive sans manifeste"

# Le manifeste fait autorité sur le contenu : chaque fichier annoncé doit être là. Un
# `grep` suffit — la validation sérieuse, empreinte par empreinte, est côté build.
# Boucle `while read` et non `mapfile` : ce dernier demande bash 4, absent de plus d'un
# système, et un script de réception n'a pas à dépendre de la version du shell.
compte=0
while IFS= read -r f; do
  case "$f" in
    ""|/*|*..*) die "chemin refusé dans le manifeste : $f" ;;
  esac
  [ -f "$NEXT/$f" ] || die "fichier annoncé mais absent de l'archive : $f"
  compte=$((compte + 1))
done <<EOF
$(grep -o '"file": *"[^"]*"' "$NEXT/manifest.json" | cut -d'"' -f4)
EOF
[ "$compte" -gt 0 ] || die "manifeste sans aucun fichier annoncé"

# L'échange, en deux mv : le build peut lire $LIVE à tout instant, et ne doit jamais y
# trouver un dataset à moitié déballé.
rm -rf "$PREV"
# `if`, pas `[ -d ... ] && mv` : sous `set -e` un test faux en fin de ligne arrête le
# script, et la toute première dépose se ferait sur un $LIVE qui n'existe pas encore.
if [ -d "$LIVE" ]; then
  mv "$LIVE" "$PREV"
fi
mv "$NEXT" "$LIVE"

log "accepté : $compte document(s) — dataset précédent conservé dans $PREV"

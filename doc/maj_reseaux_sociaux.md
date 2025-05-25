# Mettre à jour la liste des trackers existants : 

- Aller dans ubuntu
- Taper :    ```bash sudo su – postgres```
- ```bash psql```
- ```bash \c exodus```
- ```bash \copy (SELECT id,name,description,website,creation_date FROM trackers_tracker) TO '/var/lib/postgresql/exports/output_tracker.txt';```

- Récupérer le fichier `output_tracker.txt`, le placer dans le dossier maj_data et lui appliquer le script `converttrackerstojson.js` situé au même endroit

- Le fichier trackers.json ainsi créé est placé à la racine. Le mettre dans public/data/app si c’est ok

# Récupérer autorisations et tracker des apps

La liste du nom officiel des app disponibles est dans le fichier `liste nom app sur google play store.txt` dans `maj_data` à la racine du projet.

- Aller sur la page exodus de l’app à aspirer, par exemple : https://reports.exodus-privacy.eu.org/fr/reports/com.facebook.katana/latest/ et copier coller l’intégralité du code html dans un fichier txt.
- Prendre le fichier `conversionhtmlenjson.js` dans `maj_data` et faire : `node conversionhtmlenjson.js nomdufichier.txt`, le résultat est enregistré au format « id  app.json »
- Placer le résultat dans `public/data/app`
- Un tableau regroupant les identifiant google play store des app est dans le fichier react de la page comparatif. Ce nom doit correspondre aux noms des rapports json.

# Récupérer la liste et le descriptif des autorisations	depuis api exodus :

- Voir le fichier `Ubuntu-22.04\home\votre_nom\exodus\exodus\exodus\core\permissions_fr.py` et le mettre dans public/data/app



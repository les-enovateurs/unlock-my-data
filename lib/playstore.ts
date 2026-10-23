// `playstore` replaces the `app` + `exodus` pair of a fiche (#446). Both shapes
// are read until every fiche is migrated; every save writes `playstore`.

export type Playstore = { id: string; name?: string; name_en?: string; exodus?: boolean };

export type AppValue = { name?: string; link?: string };

type FicheApp = { playstore?: Playstore; app?: AppValue; exodus?: string | boolean };

const PACKAGE_ID = /^[A-Za-z][\w]*(\.[A-Za-z_][\w]*)+$/;

/** Package id of a Play Store product link, or of a bare package id. */
export const playstoreIdFromLink = (link?: string): string | undefined => {
  const value = link?.trim();
  if (!value) return undefined;
  if (PACKAGE_ID.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname !== "play.google.com" || !url.pathname.startsWith("/store/apps/details")) return undefined;
    return url.searchParams.get("id") ?? undefined;
  } catch {
    return undefined;
  }
};

export const playstoreUrl = (id: string): string =>
  `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}`;

/** The report lives at /data/compare/<slug>.json for every fiche that has one. */
export const hasExodusReport = (fiche: FicheApp): boolean =>
  Boolean(fiche.playstore?.exodus ?? fiche.exodus);

/** Name + link pair edited by the forms, whichever shape the fiche is in. */
export const appFormValue = (fiche: FicheApp): AppValue =>
  fiche.playstore
    ? { name: fiche.playstore.name, link: playstoreUrl(fiche.playstore.id) }
    : { name: fiche.app?.name, link: fiche.app?.link };

/**
 * The fiche with its app written as `playstore`. A link that is not a Play
 * Store product page (developer page, search, App Store) has no id to store:
 * it stays in `app`, with `exodus`, until someone fixes it by hand.
 */
export function withPlaystore<T extends FicheApp>(fiche: T, app: AppValue): T {
  const { app: _app, exodus, playstore, ...rest } = fiche;
  const id = playstoreIdFromLink(app.link);
  if (!id) {
    return { ...rest, ...(app.name || app.link ? { app } : {}), ...(exodus ? { exodus } : {}) } as T;
  }
  return {
    ...rest,
    playstore: {
      ...playstore,
      id,
      name: app.name?.trim() || undefined,
      ...(hasExodusReport(fiche) ? { exodus: true } : {}),
    },
  } as T;
}

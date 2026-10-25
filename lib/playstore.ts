// Android app of a fiche (#446). It replaced the `app` + `exodus` pair; the
// forms still edit a name + link, turned into `playstore` on save.

export type Playstore = { id: string; name?: string; name_en?: string; exodus?: boolean };

export type AppValue = { name?: string; link?: string };

type FicheApp = { playstore?: Playstore };

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

/** HTML `pattern` of the form's link input: a product page, never a search. */
export const PLAYSTORE_LINK_PATTERN = String.raw`https://play\.google\.com/store/apps/details\?(.*&)?id=[^&]+.*`;

export const playstoreUrl = (id: string): string =>
  `https://play.google.com/store/apps/details?id=${encodeURIComponent(id)}`;

/** The report lives at /data/compare/<slug>.json for every fiche that has one. */
export const hasExodusReport = (fiche: FicheApp): boolean => Boolean(fiche.playstore?.exodus);

/** A link the forms accept: empty, or one we can read a package id from. */
export const isValidAppLink = (link?: string): boolean => !link?.trim() || Boolean(playstoreIdFromLink(link));

export const appFormValue = (fiche: FicheApp): AppValue =>
  fiche.playstore
    ? { name: fiche.playstore.name, link: playstoreUrl(fiche.playstore.id) }
    : {};

/** The fiche with the edited name + link written back as `playstore`. */
export function withPlaystore<T extends FicheApp>(fiche: T & { app?: AppValue }, app: AppValue): T {
  const { app: _app, playstore, ...rest } = fiche;
  const id = playstoreIdFromLink(app.link);
  if (!id) return rest as T;
  return {
    ...rest,
    playstore: {
      ...playstore,
      id,
      name: app.name?.trim() || undefined,
      // A report describes one package: changing the app invalidates it.
      ...(playstore?.exodus && playstore.id === id ? { exodus: true } : { exodus: undefined }),
    },
  } as T;
}

// An untyped (`any`) object accepts any field name; a typed one only names with an `_en` twin.
type BilingualField<T> = 0 extends 1 & T
  ? string
  : { [K in keyof T & string]: K extends `${infer Field}_en` ? Field : never }[keyof T & string];

// French sits under the bare name until #456 renames the field to `_fr`: reading both lets
// a rename touch the data, not the readers. Drop the fallback once every field has its `_fr`.
export function pickLang<T>(
  obj: T | null | undefined,
  field: BilingualField<T>,
  lang: string,
): string | undefined {
  if (!obj) return undefined;
  const values = obj as unknown as Record<string, string | null | undefined>;
  const fr = values[`${field}_fr`] ?? values[field];
  const en = values[`${field}_en`];
  return (lang === "fr" ? fr || en : en || fr) || undefined;
}

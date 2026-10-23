// Optional fiche attributes are omitted, never written as null, "", [] or {} (#422).
const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "object" && !Array.isArray(value) && Object.keys(value as object).length === 0);

export const omitEmpty = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(omitEmpty).filter((item) => !isEmpty(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, omitEmpty(item)])
        .filter(([, item]) => !isEmpty(item)),
    );
  }
  return value;
};

export const ucfirst = (value: string): string => {
  if (!value) return value;
  const trimmed = value.trimStart();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return value;
  }
  const firstLetterIndex = value.search(/\p{L}/u);
  if (firstLetterIndex === -1) return value;
  return (
    value.slice(0, firstLetterIndex) +
    value.charAt(firstLetterIndex).toUpperCase() +
    value.slice(firstLetterIndex + 1)
  );
};

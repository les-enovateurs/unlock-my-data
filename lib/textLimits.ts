export const limitText = (value: string, maxLength?: number): string => {
  if (typeof maxLength !== "number" || maxLength < 0) {
    return value;
  }

  return value.slice(0, maxLength);
};

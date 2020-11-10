export const cleanupId = (code: string): string =>
  code.trim().replace(/-/g, '');

export const checkDigit = (code: string, division = 7): boolean => {
  code = cleanupId(code);

  const data = parseInt(code.slice(0, -1));
  const digit = parseInt(code.slice(-1));

  return data % division === digit;
};

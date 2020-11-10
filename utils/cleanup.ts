const cleanupId = (code: string): string => code.trim().replace(/-/g, '');

export default cleanupId;

export const SECOND = 1;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const getConfirmSentCacheKey = (uid: string) => `confirm_sent_${uid}`;

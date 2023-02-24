export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

export const isBooleanString = (value: string): boolean => value.trim() === 'true' || value.trim() === 'false';

export const parseBooleanString = (value: string): boolean => value?.trim() === 'true';
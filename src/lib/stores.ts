import { writable } from 'svelte/store';

export const currentLanguage = writable('ko');

export const global_theme = writable('light');

export const character_filter = writable([]);

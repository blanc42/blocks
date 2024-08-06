import { writable } from 'svelte/store';
import type { SelectTask } from '$lib/database/schema';

export const showDrawer = writable(false);
export const showDialog = writable(false);
export const tasks = writable<SelectTask[]>([]);
export const ktaTasks = writable<SelectTask[]>([]);
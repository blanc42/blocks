import { writable } from 'svelte/store';
import type { UserTask, KtaTask, FriendRequest, Friend } from '$lib/database/schema';

export const showDrawer = writable(false);
export const showDialog = writable(false);
export const tasks = writable<UserTask[]>([]);
export const ktaTasks = writable<KtaTask[]>([]);
export const requests = writable<FriendRequest[]>([]);
export const friends = writable<Friend[]>([]);
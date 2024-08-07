import { db } from '$lib/database';
import { friendships, users, chronosEarnings, friendRequests } from '$lib/database/schema';
import { and, eq, sum } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const friends = await db.select({
            id: friendships.friendId,
            username: users.username,
            chronosOwed: sum(chronosEarnings.chronosEarned).as('chronosOwed')
        })
        .from(friendships)
        .leftJoin(users, eq(friendships.friendId, users.id))
        .leftJoin(chronosEarnings, and(
            eq(chronosEarnings.earnerId, friendships.friendId),
            eq(chronosEarnings.taskCreatorId, locals.user.id)
        ))
        .where(eq(friendships.userId, locals.user.id))
        .groupBy(friendships.friendId, users.username);

        const pendingRequests = await db.select({
            id: friendRequests.id,
            senderUsername: users.username
        })
        .from(friendRequests)
        .leftJoin(users, eq(friendRequests.senderId, users.id))
        .where(and(
            eq(friendRequests.receiverId, locals.user.id),
            eq(friendRequests.status, 'pending')
        ));

        return { friends, pendingRequests };
    } catch (err) {
        console.error('Error fetching friends:', err);
        throw error(500, 'Error fetching friends');
    }
};

export const actions: Actions = {
    addFriend: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const friendUsername = formData.get('username') as string;

        try {
            const [friend] = await db.select().from(users).where(eq(users.username, friendUsername));

            if (!friend) {
                return { success: false, error: 'User not found' };
            }

            const [existingRequest] = await db.select()
                .from(friendRequests)
                .where(and(
                    eq(friendRequests.senderId, locals.user.id),
                    eq(friendRequests.receiverId, friend.id),
                    eq(friendRequests.status, 'pending')
                ));

            if (existingRequest) {
                return { success: false, error: 'Friend request already sent' };
            }

            await db.insert(friendRequests).values({
                senderId: locals.user.id,
                receiverId: friend.id,
                status: 'pending'
            });

            return { success: true };
        } catch (err) {
            console.error('Error sending friend request:', err);
            throw error(500, 'Error sending friend request');
        }
    },

    acceptFriendRequest: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const requestId = parseInt(formData.get('requestId') as string);

        try {
            const [friendRequest] = await db.select()
                .from(friendRequests)
                .where(and(
                    eq(friendRequests.id, requestId),
                    eq(friendRequests.receiverId, locals.user.id),
                    eq(friendRequests.status, 'pending')
                ));

            if (!friendRequest) {
                return { success: false, error: 'Friend request not found' };
            }

            // Update friend request status
            await db.update(friendRequests)
                .set({ status: 'accepted' })
                .where(eq(friendRequests.id, requestId));

            // Create friendships
           const newFriend =  await db.insert(friendships).values([
                { userId: locals.user.id, friendId: friendRequest.senderId },
                { userId: friendRequest.senderId, friendId: locals.user.id }
            ]);

            return { success: true, newFriend };
        } catch (err) {
            console.error('Error accepting friend request:', err);
            throw error(500, 'Error accepting friend request');
        }
    },

    ignoreFriendRequest: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const requestId = parseInt(formData.get('requestId') as string);

        try {
            await db.update(friendRequests)
                .set({ status: 'ignored' })
                .where(and(
                    eq(friendRequests.id, requestId),
                    eq(friendRequests.receiverId, locals.user.id),
                    eq(friendRequests.status, 'pending')
                ));

            return { success: true };
        } catch (err) {
            console.error('Error ignoring friend request:', err);
            throw error(500, 'Error ignoring friend request');
        }
    }
};
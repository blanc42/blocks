import { db } from '$lib/database';
import { tasks, friendRequests,friendships, users } from '$lib/database/schema';
import { and, eq } from 'drizzle-orm';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, setHeaders }) => {
    if (!locals.user) {
        return { tasks: [], ktaTasks: [], requests: [], friends: [] };
    }


    try {
        const [userTasks, ktaTasks, requests, friends] = await Promise.all([
            db.select({
                id: tasks.id,
                title: tasks.title,
                description: tasks.description,
                chronos: tasks.chronos,
                deadline: tasks.deadline,
                isCompleted: tasks.isCompleted,
                partnerUsername: users.username
            })
            .from(tasks)
            .leftJoin(users, eq(tasks.accountabilityPartnerId, users.id))
            .where(eq(tasks.userId, locals.user.id)),

            db.select({
                id: tasks.id,
                title: tasks.title,
                description: tasks.description,
                chronos: tasks.chronos,
                deadline: tasks.deadline,
                isCompleted: tasks.isCompleted,
                creatorUsername: users.username
            })
            .from(tasks)
            .leftJoin(users, eq(tasks.userId, users.id))
            .where(eq(tasks.accountabilityPartnerId, locals.user.id)),

            db.select({
                id: friendRequests.id,
                senderId: friendRequests.senderId,
                status: friendRequests.status,
                createdAt: friendRequests.createdAt,
                senderUsername: users.username
            })
            .from(friendRequests)
            .leftJoin(users, eq(friendRequests.senderId, users.id))
            .where(eq(friendRequests.receiverId, locals.user.id)),

            db.select({
                id: friendships.id,
                friendId: friendships.friendId,
                createdAt: friendships.createdAt,
                friendUsername: users.username
            })
            .from(friendships)
            .leftJoin(users, eq(friendships.friendId, users.id))
            .where(eq(friendships.userId, locals.user.id))
        ]);

        return { tasks: userTasks, ktaTasks, requests, friends };
    } catch (err) {
        console.error('Error fetching data:', err);
        throw error(500, 'Error fetching data');
    }
};

export const actions: Actions = {
    addTask: async ({ request, locals }) => {
        if (!locals.user) {
            return { success: false, error: 'User not authenticated' };
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const chronos = parseInt(formData.get('chronos') as string);
        const deadline = new Date(formData.get('deadline') as string);
        const accountabilityPartnerId = parseInt(formData.get('accountabilityPartnerId') as string);

        const [newTask] = await db.insert(tasks).values({
            userId: locals.user.id,
            title,
            description,
            chronos,
            deadline,
            accountabilityPartnerId
        }).returning();

        return { success: true, task: newTask };
    },

    completeTask: async ({ request, locals }) => {
        if (!locals.user) {
            return { success: false, error: 'User not authenticated' };
        }

        const formData = await request.formData();
        const taskId = parseInt(formData.get('taskId') as string);

        const [updatedTask] = await db
            .update(tasks)
            .set({ isCompleted: true })
            .where(and(eq(tasks.id, taskId), eq(tasks.userId, locals.user.id)))
            .returning();

        return { success: true, task: updatedTask };
    }
};
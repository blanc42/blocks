import { db } from '$lib/database';
import { tasks } from '$lib/database/schema';
import { eq, and, lt, gt } from 'drizzle-orm';
import type { Actions, ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }: { locals: { user?: { id: number } } }) => {
    if (!locals.user) {
        return { tasks: [], ktaTasks: [] };
    }

    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, locals.user.id));
    const ktaTasks = await db.select().from(tasks).where(eq(tasks.accountabilityPartnerId, locals.user.id));

    return {
        tasks: userTasks,
        ktaTasks: ktaTasks
    };
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
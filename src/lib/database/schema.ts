import { pgTable, serial, text, integer, timestamp, boolean, primaryKey, index } from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at')
}, (table) => ({
  deletedAtIdx: index('users_deleted_at_idx').on(table.deletedAt)
}));

// Friendships table (for accepted friendships)
export const friendships = pgTable('friendships', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  friendId: integer('friend_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (t) => ({
  userIdIdx: index('friendships_user_id_idx').on(t.userId),
  friendIdIdx: index('friendships_friend_id_idx').on(t.friendId)
}));

// Friend requests table
export const friendRequests = pgTable('friend_requests', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  receiverId: integer('receiver_id').references(() => users.id).notNull(),
  status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'rejected'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (t) => ({
  senderIdIdx: index('friend_requests_sender_id_idx').on(t.senderId),
  receiverIdIdx: index('friend_requests_receiver_id_idx').on(t.receiverId)
}));

// Tasks table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  chronos: integer('chronos').notNull(),
  deadline: timestamp('deadline').notNull(),
  accountabilityPartnerId: integer('accountability_partner_id').references(() => users.id).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at')
}, (table) => ({
  userIdIdx: index('tasks_user_id_idx').on(table.userId),
  accountabilityPartnerIdIdx: index('tasks_accountability_partner_id_idx').on(table.accountabilityPartnerId),
  deadlineIdx: index('tasks_deadline_idx').on(table.deadline),
  deletedAtIdx: index('tasks_deleted_at_idx').on(table.deletedAt)
}));

// Chronos earnings table
export const chronosEarnings = pgTable('chronos_earnings', {
  id: serial('id').primaryKey(),
  earnerId: integer('earner_id').references(() => users.id).notNull(),
  taskCreatorId: integer('task_creator_id').references(() => users.id).notNull(),
  taskId: integer('task_id').references(() => tasks.id).notNull(),
  chronosEarned: integer('chronos_earned').notNull(),
  earnedAt: timestamp('earned_at').defaultNow().notNull()
}, (table) => ({
  earnerIdIdx: index('chronos_earnings_earner_id_idx').on(table.earnerId),
  taskCreatorIdIdx: index('chronos_earnings_task_creator_id_idx').on(table.taskCreatorId),
  taskIdIdx: index('chronos_earnings_task_id_idx').on(table.taskId)
}));


export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
export type InsertFriendship = InferInsertModel<typeof friendships>;
export type SelectFriendship = InferSelectModel<typeof friendships>;
export type InsertTask = InferInsertModel<typeof tasks>;
export type SelectTask = InferSelectModel<typeof tasks>;
export type InsertFriendRequest = InferInsertModel<typeof friendRequests>;
export type SelectFriendRequest = InferSelectModel<typeof friendRequests>;



export type UserTask = {
  id: SelectTask['id'];
  title: SelectTask['title'];
  description: SelectTask['description'];
  chronos: SelectTask['chronos'];
  deadline: SelectTask['deadline'];
  isCompleted: SelectTask['isCompleted'];
  partnerUsername: SelectUser['username'] | null;
};

export type KtaTask = {
  id: SelectTask['id'];
  title: SelectTask['title'];
  description: SelectTask['description'];
  chronos: SelectTask['chronos'];
  deadline: SelectTask['deadline'];
  isCompleted: SelectTask['isCompleted'];
  creatorUsername: SelectUser['username'] | null;
};

export type FriendRequest = {
  id: SelectFriendRequest['id'];
  senderId: SelectFriendRequest['senderId'];
  status: SelectFriendRequest['status'];
  createdAt: SelectFriendRequest['createdAt'];
  senderUsername: SelectUser['username'] | null;
};

export type Friend = {
  id: number;
  friendId: number;
  createdAt: Date;
  friendUsername: string | null;
};
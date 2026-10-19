import { sqliteTable,text,integer } from 'drizzle-orm/sqlite-core';
export const settings=sqliteTable('settings',{key:text('key').primaryKey(),value:text('value').notNull(),version:integer('version').notNull().default(1)});
export const orders=sqliteTable('orders',{id:text('id').primaryKey(),token:text('token').notNull().unique(),idempotency:text('idempotency').notNull().unique(),fingerprint:text('fingerprint').notNull(),status:text('status').notNull(),payload:text('payload').notNull(),createdAt:text('created_at').notNull()});
export const submissions=sqliteTable('submissions',{id:text('id').primaryKey(),kind:text('kind').notNull(),email:text('email').notNull(),payload:text('payload').notNull(),createdAt:text('created_at').notNull()});
export const subscribers=sqliteTable('subscribers',{email:text('email').primaryKey(),createdAt:text('created_at').notNull()});
export const limits=sqliteTable('request_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});
export const events=sqliteTable('admin_events',{id:text('id').primaryKey(),actor:text('actor').notNull(),action:text('action').notNull(),createdAt:text('created_at').notNull()});

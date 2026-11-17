import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { MAX_OWNER_LENGTH } from './sessions.constants.js';

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: varchar('type', { length: 32 }).notNull(),
    owner: varchar('owner', { length: MAX_OWNER_LENGTH }).notNull(),
    imageAUrl: text('image_a_url').notNull(),
    imageBUrl: text('image_b_url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    progress: integer('progress'),
    status: varchar('status', { length: 32 }).notNull().default('pending'),
    notes: text('notes').notNull().default(''),
    logs: text('logs'),
  },
  (table) => [
    index('sessions_updated_at_idx').on(table.updatedAt.desc(), table.id),
    index('sessions_type_idx').on(table.type),
  ],
);

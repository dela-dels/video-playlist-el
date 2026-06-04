import { NOW, column, defineDb, defineTable } from 'astro:db';

const Video = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    creator: column.text({ default: 'Unknown creator' }),
    url: column.text({ unique: true }),
    embedUrl: column.text(),
    thumbnailUrl: column.text({ default: '' }),
    duration: column.text({ default: 'WATCH' }),
    isFavorite: column.boolean({ default: false }),
    createdAt: column.date({ default: NOW }),
  },
  indexes: [{ on: ['createdAt', 'id'] }],
});

export default defineDb({
  tables: { Video },
});

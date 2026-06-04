import { Video as VideoTable, db, desc, eq } from 'astro:db';

export type Video = {
  id: number;
  title: string;
  creator: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration: string;
  isFavorite: boolean;
  createdAt: string;
};

type VideoRow = typeof VideoTable.$inferSelect;

function mapVideo(row: VideoRow): Video {
  const parsed = parseVideoUrl(row.url);

  return {
    ...row,
    embedUrl: parsed.embedUrl,
    thumbnailUrl: parsed.thumbnailUrl || row.thumbnailUrl,
    createdAt: row.createdAt.toISOString(),
  };
}

export function parseVideoUrl(value: string) {
  const url = new URL(value);
  let youtubeId = '';

  if (url.hostname === 'youtu.be') {
    youtubeId = url.pathname.slice(1).split('/')[0];
  } else if (url.hostname.endsWith('youtube.com')) {
    youtubeId =
      url.searchParams.get('v') ??
      url.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1] ??
      '';
  }

  if (youtubeId) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&playsinline=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }

  return {
    embedUrl: url.toString(),
    thumbnailUrl: '',
  };
}

export async function listVideos() {
  const rows = await db.select().from(VideoTable).orderBy(desc(VideoTable.id), desc(VideoTable.createdAt));
  return rows.map(mapVideo);
}

export async function createVideo(input: {
  title: string;
  creator?: string;
  url: string;
  duration?: string;
}) {
  const parsed = parseVideoUrl(input.url);
  const [row] = await db
    .insert(VideoTable)
    .values({
      title: input.title.trim(),
      creator: input.creator?.trim() || 'Unknown creator',
      url: input.url,
      embedUrl: parsed.embedUrl,
      thumbnailUrl: parsed.thumbnailUrl,
      duration: input.duration?.trim() || 'WATCH',
    })
    .returning();

  return mapVideo(row);
}

export async function toggleFavorite(id: number) {
  const [current] = await db.select().from(VideoTable).where(eq(VideoTable.id, id));
  if (!current) return null;

  const [row] = await db
    .update(VideoTable)
    .set({ isFavorite: !current.isFavorite })
    .where(eq(VideoTable.id, id))
    .returning();

  return mapVideo(row);
}

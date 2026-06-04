import { db, Video } from 'astro:db';

const seedVideos = [
  {
    id: 1,
    title: 'The Art of Creative Coding',
    creator: 'Design Archive',
    url: 'https://www.youtube.com/watch?v=4cOr7JmcOas',
    duration: '12:42',
  },
  {
    id: 2,
    title: 'Inside a Minimalist Dream Home',
    creator: 'Open Spaces',
    url: 'https://www.youtube.com/watch?v=QFjU7lYb0oI',
    duration: '08:16',
  },
  {
    id: 3,
    title: 'Future Sounds: Live Session',
    creator: 'Neon Room',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    duration: '24:08',
  },
  {
    id: 4,
    title: 'Why Good Design Feels Invisible',
    creator: 'Form & Function',
    url: 'https://www.youtube.com/watch?v=ZK86XQ1iFVs',
    duration: '16:50',
  },
];

function parseYouTubeUrl(value: string) {
  const url = new URL(value);
  const youtubeId = url.searchParams.get('v') ?? '';

  return {
    embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&playsinline=1`,
    thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}

export default async function seed() {
  await db
    .insert(Video)
    .values(
      seedVideos.map((video) => ({
        ...video,
        ...parseYouTubeUrl(video.url),
        isFavorite: false,
        createdAt: new Date(`2026-06-04T14:41:0${video.id}Z`),
      })),
    )
    .onConflictDoNothing();
}

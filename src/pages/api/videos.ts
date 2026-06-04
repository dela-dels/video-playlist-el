import type { APIRoute } from 'astro';
import { createVideo, listVideos } from '../../lib/videos';

export const GET: APIRoute = async () => {
  return Response.json({ videos: await listVideos() });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;
    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    const url = typeof payload.url === 'string' ? payload.url.trim() : '';

    if (!title || !url) {
      return Response.json({ error: 'Title and video URL are required.' }, { status: 400 });
    }

    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return Response.json({ error: 'Use a valid http or https video URL.' }, { status: 400 });
    }

    const video = await createVideo({
      title,
      url: parsed.toString(),
      creator: typeof payload.creator === 'string' ? payload.creator : undefined,
      duration: typeof payload.duration === 'string' ? payload.duration : undefined,
    });

    return Response.json({ video }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes('UNIQUE')
        ? 'That video has already been added.'
        : 'Unable to add this video. Check the URL and try again.';

    return Response.json({ error: message }, { status: 400 });
  }
};

import type { APIRoute } from 'astro';
import { toggleFavorite } from '../../../../lib/videos';

export const POST: APIRoute = async ({ params }) => {
  const id = Number(params.id);

  if (!Number.isInteger(id)) {
    return Response.json({ error: 'Invalid video id.' }, { status: 400 });
  }

  const video = await toggleFavorite(id);
  if (!video) {
    return Response.json({ error: 'Video not found.' }, { status: 404 });
  }

  return Response.json({ video });
};

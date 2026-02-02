import { getSessionUser } from '../../api/auth.lib';

interface Env {
  DB: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Cookie',
  'Access-Control-Allow-Credentials': 'true',
};

const jsonResponse = (payload: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Verify admin session
  const user = await getSessionUser(env, request);
  if (!user || user.role !== 'admin') {
    return jsonResponse({ error: 'Unauthorized' }, 403);
  }

  try {
    // GET - List all news (including unpublished)
    if (request.method === 'GET') {
      const result = await env.DB
        .prepare('SELECT * FROM news ORDER BY published_at DESC')
        .all();
      return jsonResponse({ news: result?.results ?? [] });
    }

    // POST - Create new news item
    if (request.method === 'POST') {
      const body = await request.json() as {
        title_en: string;
        title_ru: string;
        title_uz: string;
        content_en: string;
        content_ru: string;
        content_uz: string;
        is_published?: boolean;
      };

      const id = crypto.randomUUID();
      const is_published = body.is_published ? 1 : 0;

      await env.DB
        .prepare(`
          INSERT INTO news (id, title_en, title_ru, title_uz, content_en, content_ru, content_uz, is_published, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `)
        .bind(
          id,
          body.title_en,
          body.title_ru,
          body.title_uz,
          body.content_en,
          body.content_ru,
          body.content_uz,
          is_published
        )
        .run();

      return jsonResponse({ success: true, id });
    }

    // PUT - Update existing news item
    if (request.method === 'PUT') {
      const body = await request.json() as {
        id: string;
        title_en?: string;
        title_ru?: string;
        title_uz?: string;
        content_en?: string;
        content_ru?: string;
        content_uz?: string;
        is_published?: boolean;
      };

      if (!body.id) {
        return jsonResponse({ error: 'Missing news ID' }, 400);
      }

      const updates: string[] = [];
      const values: unknown[] = [];

      if (body.title_en !== undefined) {
        updates.push('title_en = ?');
        values.push(body.title_en);
      }
      if (body.title_ru !== undefined) {
        updates.push('title_ru = ?');
        values.push(body.title_ru);
      }
      if (body.title_uz !== undefined) {
        updates.push('title_uz = ?');
        values.push(body.title_uz);
      }
      if (body.content_en !== undefined) {
        updates.push('content_en = ?');
        values.push(body.content_en);
      }
      if (body.content_ru !== undefined) {
        updates.push('content_ru = ?');
        values.push(body.content_ru);
      }
      if (body.content_uz !== undefined) {
        updates.push('content_uz = ?');
        values.push(body.content_uz);
      }
      if (body.is_published !== undefined) {
        updates.push('is_published = ?');
        values.push(body.is_published ? 1 : 0);
      }

      if (updates.length === 0) {
        return jsonResponse({ error: 'No fields to update' }, 400);
      }

      values.push(body.id);

      await env.DB
        .prepare(`UPDATE news SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();

      return jsonResponse({ success: true });
    }

    // DELETE - Delete news item
    if (request.method === 'DELETE') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');

      if (!id) {
        return jsonResponse({ error: 'Missing news ID' }, 400);
      }

      await env.DB
        .prepare('DELETE FROM news WHERE id = ?')
        .bind(id)
        .run();

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch (error) {
    console.error('Admin news error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
};

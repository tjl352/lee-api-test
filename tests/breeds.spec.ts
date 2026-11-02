import { expect, test } from '@playwright/test';

test('GET /breeds returns a breed', async ({ request }) => {
  const response = await request.get('breeds', {
    params: {
      'page[number]': 1,
      'page[size]': 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data).toHaveLength(1);
  expect(body.data[0].id).toEqual(expect.any(String));
  expect(body.data[0].type).toBe('breed');
  expect(body.data[0].attributes.name).toEqual(expect.any(String));
  expect(body.meta.pagination.current).toBe(1);
  expect(body.meta.pagination.records).toBeGreaterThan(0);
  expect(body.data[0].relationships.group.data).toMatchObject({
    id: expect.any(String),
    type: 'group',
  });
});

test('GET /breeds returns no breeds past the last page', async ({ request }) => {
  const response = await request.get('breeds', {
    params: {
      'page[number]': 99999,
      'page[size]': 1,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.data).toEqual([]);
});

test('GET /breeds/{id} returns that breed', async ({ request }) => {
  const list = await request.get('breeds', {
    params: {
      'page[number]': 1,
      'page[size]': 1,
    },
  });
  const id = (await list.json()).data[0].id;

  const response = await request.get(`breeds/${id}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data.id).toBe(id);
  expect(body.data.type).toBe('breed');
  expect(body.data.attributes.name).toEqual(expect.any(String));
  expect(body.data.relationships.group.data).toMatchObject({
    id: expect.any(String),
    type: 'group',
  });
});

test('GET /breeds/{id} returns 404 for an unknown id', async ({ request }) => {
  const response = await request.get('breeds/00000000-0000-0000-0000-000000000000');

  expect(response.status()).toBe(404);
});

test('GET /breeds/{id}/image redirects to that breed image', async ({ request }) => {
  const list = await request.get('breeds', {
    params: {
      'page[number]': 1,
      'page[size]': 1,
    },
  });
  const id = (await list.json()).data[0].id;

  const response = await request.get(`breeds/${id}/image`, {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(302);
  expect(response.headers().location).toEqual(expect.any(String));
});

test('GET /breeds/{id}/image returns 404 for an unknown id', async ({ request }) => {
  const response = await request.get('breeds/00000000-0000-0000-0000-000000000000/image', {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(404);
});

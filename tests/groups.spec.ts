import { expect, test } from '@playwright/test';

test('GET /groups returns groups ordered by name', async ({ request }) => {
  const response = await request.get('groups', {
    params: {
      'page[number]': 1,
      'page[size]': 3,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data).toHaveLength(3);
  expect(body.meta.pagination.current).toBe(1);
  expect(body.meta.pagination.records).toBeGreaterThanOrEqual(3);

  const names = (body.data as { attributes: { name: string } }[]).map(
    (group) => group.attributes.name,
  );
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));

  for (const group of body.data) {
    expect(group.id).toEqual(expect.any(String));
    expect(group.type).toBe('group');
    expect(group.attributes.name.length).toBeGreaterThan(0);
    expect(group.relationships.breeds.data[0]).toMatchObject({
      id: expect.any(String),
      type: 'breed',
    });
  }
});

test('GET /groups returns no groups past the last page', async ({ request }) => {
  const response = await request.get('groups', {
    params: {
      'page[number]': 99999,
      'page[size]': 1,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.data).toEqual([]);
});

test('GET /groups/{id} returns that group', async ({ request }) => {
  const list = await request.get('groups', {
    params: {
      'page[number]': 1,
      'page[size]': 1,
    },
  });
  const id = (await list.json()).data[0].id;

  const response = await request.get(`groups/${id}`);

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data.id).toBe(id);
  expect(body.data.attributes.name.length).toBeGreaterThan(0);
  expect(body.links.self).toBe(`https://dogapi.dog/api/v2/groups/${id}`);
});

test('GET /groups/{id} returns 404 for an unknown id', async ({ request }) => {
  const response = await request.get('groups/00000000-0000-0000-0000-000000000000');

  expect(response.status()).toBe(404);
});

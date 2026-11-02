import { expect, test } from '@playwright/test';

test('GET /groups returns a group', async ({ request }) => {
  const response = await request.get('groups', {
    params: {
      'page[number]': 1,
      'page[size]': 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data).toHaveLength(1);
  expect(body.data[0].id).toEqual(expect.any(String));
  expect(body.data[0].type).toBe('group');
  expect(body.data[0].attributes.name).toEqual(expect.any(String));
  expect(body.meta.pagination.current).toBe(1);
  expect(body.meta.pagination.records).toBeGreaterThan(0);
  expect(body.data[0].relationships.breeds.data[0]).toMatchObject({
    id: expect.any(String),
    type: 'breed',
  });
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

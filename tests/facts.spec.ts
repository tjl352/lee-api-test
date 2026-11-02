import { expect, test } from '@playwright/test';

test('GET /facts returns a fact', async ({ request }) => {
  const response = await request.get('facts', {
    params: {
      limit: 1,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.data).toHaveLength(1);
  expect(body.data[0].id).toEqual(expect.any(String));
  expect(body.data[0].type).toBe('fact');
  expect(body.data[0].attributes.body).toEqual(expect.any(String));
});

test('GET /facts returns five facts when limit is above the maximum', async ({ request }) => {
  const response = await request.get('facts', {
    params: {
      limit: 99999,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.data).toHaveLength(5);
});

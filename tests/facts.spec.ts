import { expect, test } from '@playwright/test';

test('GET /facts returns the number of facts you ask for', async ({ request }) => {
  const response = await request.get('facts', {
    params: {
      limit: 3,
    },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toBe('no-store');

  const body = await response.json();
  expect(body.data).toHaveLength(3);

  for (const fact of body.data) {
    expect(fact.id).toEqual(expect.any(String));
    expect(fact.type).toBe('fact');
    expect(fact.attributes.body.length).toBeGreaterThan(0);
  }
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

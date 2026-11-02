import { expect, test } from '@playwright/test';

test('GET /breeds returns a breed', async ({ request }) => {
  const response = await request.get('breeds', {
    params: {
      'page[number]': 1,
      'page[size]': 1,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.data[0].type).toBe('breed');
  expect(body.data[0].attributes.name).toEqual(expect.any(String));
});

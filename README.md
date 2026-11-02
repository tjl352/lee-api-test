# Dog API tests

Playwright API tests for the [Dog API v2](https://dogapi.dog/docs/api-v2). The tests use TypeScript and the `request` fixture. No browser is required.

The base URL is `https://dogapi.dog/api/v2/`. Paths in the tests are relative, such as `breeds`. A leading slash drops `/api/v2` and hits the website instead of the API.

## Setup

```bash
npm install
```

Skip the browser download:

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

## Run

All tests:

```bash
npm test
```

One file:

```bash
npx playwright test tests/breeds.spec.ts
npx playwright test tests/groups.spec.ts
npx playwright test tests/facts.spec.ts
```

## Coverage

| File | Endpoints |
| --- | --- |
| `tests/breeds.spec.ts` | `GET /breeds`, `GET /breeds/{id}`, `GET /breeds/{id}/image`, `GET /breeds/image` |
| `tests/groups.spec.ts` | `GET /groups`, `GET /groups/{id}` |
| `tests/facts.spec.ts` | `GET /facts` |

Each endpoint has one success case and one failure case.

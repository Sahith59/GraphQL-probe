import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(new URL("../app/api/graphql/route.ts", import.meta.url), "utf8");
const data = await readFile(new URL("../app/lib/data.ts", import.meta.url), "utf8");
const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("graphql route exports POST at the requested API route", () => {
  assert.match(route, /export\s+async\s+function\s+POST/);
  assert.match(readme, /app\/api\/graphql\/route\.ts/);
  assert.match(readme, /query\s+\{\s*order\(id:\s*"4021"\)/);
});

test("order id is read from GraphQL args and response exposes ownerId", () => {
  assert.match(route, /args:\s*{\s*id:\s*{\s*type:\s*GraphQLString\s*}/);
  assert.match(route, /ownerId:\s*{\s*type:\s*GraphQLString\s*}/);
  assert.match(route, /findOrderById\(args\.id\)/);
  assert.match(data, /ownerId:\s*"usr_101"/);
});

test("resolver is intentionally authenticated but not owner scoped", () => {
  assert.match(route, /requireUserResponse/);
  assert.doesNotMatch(route, /order\.ownerId\s*!==\s*auth\.user\.id/);
  assert.doesNotMatch(route, /order\.ownerId\s*===\s*auth\.user\.id/);
  assert.match(route, /Intentional BOLA/);
});

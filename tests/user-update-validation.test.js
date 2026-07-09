import test from "node:test";
import assert from "node:assert/strict";

import { updateCurrentUserValidation } from "../src/validations/index.js";

test("updateCurrentUserValidation allows only editable profile fields", async () => {
  const req = {
    method: "PATCH",
    url: "/api/users/me",
    body: {
      name: "John Doe",
      avatarUrl: "https://example.com/avatar.png",
    },
  };
  const res = {};

  let nextCalled = false;
  let error = null;

  await new Promise((resolve) => {
    updateCurrentUserValidation(req, res, (err) => {
      nextCalled = true;
      error = err || null;
      resolve();
    });
  });

  assert.equal(nextCalled, true);
  assert.equal(error, null);
});

test("updateCurrentUserValidation rejects unsupported fields", async () => {
  const req = {
    method: "PATCH",
    url: "/api/users/me",
    body: {
      name: "John Doe",
      role: "admin",
    },
  };
  const res = {};

  let nextCalled = false;
  let error = null;

  await new Promise((resolve) => {
    updateCurrentUserValidation(req, res, (err) => {
      nextCalled = true;
      error = err || null;
      resolve();
    });
  });

  assert.equal(nextCalled, true);
  assert.ok(error);
  assert.match(error.message, /Validation failed/i);
});

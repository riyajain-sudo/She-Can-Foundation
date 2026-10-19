import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { Contact } from "../src/models/contactModel.js";
import { getContacts, submitContact, validateContact } from "../src/controllers/contactController.js";
import contactRoutes from "../src/routes/contactRoutes.js";

const valid = { name: "Ada Lovelace", email: "ada@example.org", message: "A synthetic test message." };
function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("rejects non-object bodies, wrong field types, malformed email, and oversized values", () => {
  for (const body of [null, [], 3]) assert.ok(Object.keys(validateContact(body).errors).length);
  assert.ok(Object.keys(validateContact({}).errors).length);
  for (const body of [{ ...valid, name: 7 }, { ...valid, email: "x@bad" }, { ...valid, message: "x".repeat(1001) }]) {
    assert.ok(Object.keys(validateContact(body).errors).length);
  }
  assert.deepEqual(validateContact(valid).errors, {});
});

test("returns 503 demo disclosure without logging or retaining a disconnected submission", async () => {
  const oldState = mongoose.connection.readyState;
  mongoose.connection.readyState = 0;
  const res = response();
  const logged = [];
  const originalLog = console.log;
  console.log = (...args) => logged.push(args.join(" "));
  try {
    await submitContact({ body: valid }, res);
  } finally {
    console.log = originalLog;
    mongoose.connection.readyState = oldState;
  }
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, "DEMO_ONLY");
  assert.equal(JSON.stringify(res.body).includes(valid.email), false);
  assert.equal(logged.join(" ").includes(valid.email), false);
  assert.equal(logged.join(" ").includes(valid.message), false);
});

test("successful response follows durable create and returns only an opaque receipt", async () => {
  const originalCreate = Contact.create;
  const oldState = mongoose.connection.readyState;
  mongoose.connection.readyState = 1;
  Contact.create = async (values) => ({ _id: "synthetic-receipt", values });
  try {
    const res = response();
    await submitContact({ body: valid }, res);
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.receiptId, "synthetic-receipt");
    assert.equal("contact" in res.body, false);
  } finally {
    Contact.create = originalCreate;
    mongoose.connection.readyState = oldState;
  }
});

test("contact-list access is denied without querying or disclosing records", async () => {
  const res = response();
  await getContacts({}, res);
  assert.equal(res.statusCode, 403);
  assert.equal("contacts" in res.body, false);
});

test("anonymous contact-list route is not registered", () => {
  assert.deepEqual(contactRoutes.stack.map(({ route }) => Object.keys(route.methods)[0]), ["post"]);
});

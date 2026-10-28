import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import type { Server } from "node:http";
import app from "../src/app";

let server: Server;
let baseUrl: string;

before(async () => {
  // Porta 0 = o sistema escolhe uma porta livre, para o teste não colidir com o servidor de desenvolvimento.
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

async function post(path: string, body: unknown, raw = false) {
  const res = await fetch(baseUrl + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
  return { status: res.status, json: (await res.json()) as any };
}

const validRegister = {
  role: "aluno",
  name: "Maria Silva",
  email: "maria@exemplo.com",
  password: "senha1234",
};

describe("GET /health", () => {
  it("responde 200 com status ok", async () => {
    const res = await fetch(baseUrl + "/health");
    const json = (await res.json()) as any;
    assert.equal(res.status, 200);
    assert.equal(json.status, "ok");
  });
});

describe("rota inexistente", () => {
  it("responde 404 no formato padrão de erro", async () => {
    const res = await fetch(baseUrl + "/nao-existe");
    const json = (await res.json()) as any;
    assert.equal(res.status, 404);
    assert.equal(json.error.code, "NOT_FOUND");
  });
});

describe("POST /auth/register", () => {
  it("dados válidos passam na validação e recebem 501 (sem banco ainda)", async () => {
    const { status, json } = await post("/auth/register", validRegister);
    assert.equal(status, 501);
    assert.equal(json.error.code, "NOT_IMPLEMENTED");
  });

  it("corpo vazio retorna 400 com todos os campos", async () => {
    const { status, json } = await post("/auth/register", {});
    assert.equal(status, 400);
    assert.equal(json.error.code, "VALIDATION_ERROR");
    assert.deepEqual(Object.keys(json.error.fields).sort(), ["email", "name", "password", "role"]);
  });

  it("senha com menos de 8 caracteres retorna 400", async () => {
    const { status, json } = await post("/auth/register", { ...validRegister, password: "1234567" });
    assert.equal(status, 400);
    assert.equal(json.error.fields.password, "A senha deve ter pelo menos 8 caracteres.");
  });

  it("perfil fora de aluno/professor retorna 400", async () => {
    const { status, json } = await post("/auth/register", { ...validRegister, role: "admin" });
    assert.equal(status, 400);
    assert.ok(json.error.fields.role);
  });

  it("e-mail inválido retorna 400", async () => {
    const { status, json } = await post("/auth/register", { ...validRegister, email: "maria@" });
    assert.equal(status, 400);
    assert.equal(json.error.fields.email, "Digite um e-mail válido.");
  });

  it("tipos errados (número no lugar de texto) retornam 400, sem quebrar o servidor", async () => {
    const { status, json } = await post("/auth/register", { ...validRegister, name: 123, password: 12345678 });
    assert.equal(status, 400);
    assert.ok(json.error.fields.name);
    assert.ok(json.error.fields.password);
  });

  it("JSON malformado retorna 400 INVALID_JSON", async () => {
    const { status, json } = await post("/auth/register", "{nao-e-json", true);
    assert.equal(status, 400);
    assert.equal(json.error.code, "INVALID_JSON");
  });
});

describe("POST /auth/login", () => {
  it("dados válidos passam na validação e recebem 501", async () => {
    const { status, json } = await post("/auth/login", { email: "maria@exemplo.com", password: "qualquer" });
    assert.equal(status, 501);
    assert.equal(json.error.code, "NOT_IMPLEMENTED");
  });

  it("sem senha retorna 400", async () => {
    const { status, json } = await post("/auth/login", { email: "maria@exemplo.com" });
    assert.equal(status, 400);
    assert.equal(json.error.fields.password, "Informe sua senha.");
  });
});

describe("POST /auth/forgot-password", () => {
  it("e-mail válido passa na validação e recebe 501", async () => {
    const { status } = await post("/auth/forgot-password", { email: "maria@exemplo.com" });
    assert.equal(status, 501);
  });

  it("sem e-mail retorna 400", async () => {
    const { status, json } = await post("/auth/forgot-password", {});
    assert.equal(status, 400);
    assert.equal(json.error.fields.email, "Informe seu e-mail.");
  });
});

#!/usr/bin/env node
import { stdin, stdout, argv } from "node:process";
import { fileURLToPath } from "node:url";

const PROTOCOL = "2025-03-26";
const ZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney"
];

const TOOLS = [
  { name: "utc-time", description: "Current UTC timestamp.", inputSchema: { type: "object", properties: {} } },
  {
    name: "timezone",
    description: "Current local time in a named IANA timezone.",
    inputSchema: { type: "object", properties: { zone: { type: "string", description: "IANA timezone name" } } }
  },
  {
    name: "validate-json",
    description: "Check whether text is valid JSON. The text is discarded.",
    inputSchema: { type: "object", properties: { json: { type: "string" } } }
  },
  {
    name: "normalize-url",
    description: "Return origin, host, and path for a URL. Query and fragment are dropped. No network request is made.",
    inputSchema: { type: "object", properties: { url: { type: "string" } } }
  },
  { name: "iana-zones", description: "Common IANA timezone names for clock calls.", inputSchema: { type: "object", properties: {} } }
];

export function callTool(name, args = {}) {
  if (name === "utc-time") return { utc: new Date().toISOString(), source: "local-clock" };
  if (name === "timezone") {
    const zone = String(args.zone || args.timezone || "UTC");
    try {
      return {
        zone,
        local: new Intl.DateTimeFormat("en-GB", { timeZone: zone, dateStyle: "medium", timeStyle: "long" }).format(new Date())
      };
    } catch {
      return { error: "Unknown IANA timezone." };
    }
  }
  if (name === "validate-json") {
    try {
      JSON.parse(String(args.json ?? args.text ?? ""));
      return { valid: true, discarded: true };
    } catch {
      return { valid: false, discarded: true };
    }
  }
  if (name === "normalize-url") {
    try {
      const parsed = new URL(String(args.url || ""));
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return { error: "HTTP or HTTPS URL required." };
      return { origin: parsed.origin, host: parsed.hostname, path: parsed.pathname };
    } catch {
      return { error: "Invalid URL." };
    }
  }
  if (name === "iana-zones") return { zones: ZONES };
  return null;
}

export function handleRpc(payload) {
  const id = payload?.id ?? null;
  const method = payload?.method;
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: { name: "open-agent-utility-index", version: "1.0.0" }
      }
    };
  }
  if (method === "tools/list") return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
  if (method === "tools/call") {
    const name = payload?.params?.name;
    const result = callTool(name, payload?.params?.arguments || {});
    if (!result) return { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } };
    return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(result) }] } };
  }
  if (method === "ping") return { jsonrpc: "2.0", id, result: {} };
  if (method === "notifications/initialized") return null;
  return { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } };
}

function send(message) {
  const json = JSON.stringify(message);
  stdout.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`);
}

function listen() {
  let buffer = Buffer.alloc(0);
  stdin.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const headerEnd = buffer.indexOf("\r\n\r\n");
      if (headerEnd === -1) break;
      const header = buffer.slice(0, headerEnd).toString("utf8");
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) {
        buffer = buffer.slice(headerEnd + 4);
        continue;
      }
      const length = Number(match[1]);
      const start = headerEnd + 4;
      if (buffer.length < start + length) break;
      const body = buffer.slice(start, start + length).toString("utf8");
      buffer = buffer.slice(start + length);
      let payload;
      try {
        payload = JSON.parse(body);
      } catch {
        send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
        continue;
      }
      const reply = handleRpc(payload);
      if (reply) send(reply);
    }
  });
}

if (fileURLToPath(import.meta.url) === argv[1]) listen();

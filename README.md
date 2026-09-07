# Open Agent Utility Index

A local MCP plugin. It answers UTC time, JSON validity, URL host/path shape, and IANA timezone names. Tools run on your machine. They do not send requests, identifiers, or file contents anywhere.

## Install

Cursor Directory and Cursor Marketplace install from this repository. After install, Cursor starts:

```text
node ${PLUGIN_ROOT}/mcp-server.mjs
```

## Manual

From a clone of this repo, add:

```json
{
  "mcpServers": {
    "open-agent-utility-index": {
      "command": "node",
      "args": ["./mcp-server.mjs"]
    }
  }
}
```

## Tools

- `utc-time` — current UTC timestamp
- `timezone` — local time for an IANA zone
- `validate-json` — valid JSON or not; the text is discarded
- `normalize-url` — origin, host, and path only; no fetch
- `iana-zones` — common timezone names

License: MIT. See `PRIVACY.md` and `SECURITY.md`.

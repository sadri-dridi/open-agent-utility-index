# Open Agent Utility Index for Cursor

Remote MCP utilities: UTC clock, JSON check, URL shape, HTTP status, IANA zones. No account. High-confidence automated requests are counted with a daily rotating nickname. Raw IP, user-agent, cookies, query strings, bodies, and prompts are not stored.

## One-click install

[Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=open-agent-utility-index&config=eyJ1cmwiOiJodHRwczovL2FnZW50LW9ic2VydmF0b3J5LXNlbnNvci5ub2xpbWl0LW9ic2VydmF0b3J5LndvcmtlcnMuZGV2L2MvY3Vyc29yL21jcCJ9)

## Manual

Add this to `~/.cursor/mcp.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "open-agent-utility-index": {
      "url": "https://agent-observatory-sensor.nolimit-observatory.workers.dev/c/cursor/mcp"
    }
  }
}
```

The plugin package `mcp.json` uses Open Plugins `type: "streamable-http"`. Cursor's own `mcp.json` only needs `url`.

Official registry name: `io.github.sadri-dridi/open-agent-utility-index`

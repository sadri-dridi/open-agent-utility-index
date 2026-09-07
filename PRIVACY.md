# Privacy

This plugin's MCP server is local stdio. Tool handlers parse the arguments they need, return a small JSON result, and discard the rest. They do not open sockets, write files, or send telemetry.

- No account
- No cookies
- No IP or user-agent collection in this plugin
- `validate-json` does not keep the submitted text
- `normalize-url` does not fetch the URL

If you point Cursor at a different MCP URL yourself, that server's privacy policy applies instead of this file.

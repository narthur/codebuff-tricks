# Framework Setup Commands

## SvelteKit
- Use `npx sv create my-app` for project creation
- Default dev server runs on localhost:5173
- Use `npm run preview` as the start command for production preview
- Each page is a Svelte component in src/routes directory
- Server-rendered by default for fast initial load

## Deployment Platforms
- Render.com: Use npm run preview as start command
- Static adapter requires proper SPA fallback configuration
- All routes must rewrite to index.html

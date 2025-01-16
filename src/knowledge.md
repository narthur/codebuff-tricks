# SvelteKit Static Site Configuration

## Deployment
- Using `@sveltejs/adapter-static` for static site generation
- All routes must rewrite to index.html to support client-side routing
- For Render.com deployment:
  - Use proper MIME types for JavaScript files
  - Configure caching for immutable assets
  - Ensure proper handling of static assets
  - Keep `source: /*` pattern in render.yaml for route rewrites

## Development
- Run `npm run dev` for local development
- Run `npm run build` followed by `npm run preview` to test production build locally

## Common Issues
- JavaScript module loading issues can be fixed by proper MIME type configuration
- Static assets should be properly cached with immutable cache headers for /_app/immutable/*
- SPA routing requires proper fallback configuration in both adapter and hosting platform

# Instrucciones para Codex

Leer `CLAUDE.md` para las reglas compartidas y `PLAN.md` para los requisitos.
La instrucción expresa del usuario prevalece: el proyecto vive directamente en esta raíz y se ejecuta una sola fase por solicitud.
No avanzar a la siguiente fase sin una nueva solicitud del usuario.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

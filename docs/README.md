# Glowmi Documentation

All documentation is available in English and Korean.

## Documents

| Document | EN | KO | Description |
|----------|----|----|-------------|
| AI Architecture | [en/rag-architecture.md](en/rag-architecture.md) | [ko/rag-architecture.md](ko/rag-architecture.md) | RAG + Agentic AI architecture, infrastructure diagrams |
| SEO & GEO Guide | [en/seo-geo-guide.md](en/seo-geo-guide.md) | [ko/seo-geo-guide.md](ko/seo-geo-guide.md) | SEO strategy, structured data, AI bot management |
| Dev Guide | [en/dev-guide.md](en/dev-guide.md) | [ko/dev-guide.md](ko/dev-guide.md) | Project overview, tech stack, component structure |
| Feature Backlog | [en/feature-backlog.md](en/feature-backlog.md) | [ko/feature-backlog.md](ko/feature-backlog.md) | Implemented features, future ideas |
| Environment Setup | [en/env-setup.md](en/env-setup.md) | [ko/env-setup.md](ko/env-setup.md) | Environment variables, local/production setup |

## Notion Sync

Documentation is automatically synced to Notion when changes are pushed to `main`.

- **Workflow**: `.github/workflows/sync-docs-to-notion.yml`
- **Sync script**: `docs/notion-sync/sync.mjs`
- **Required secrets**: `NOTION_TOKEN`, `NOTION_DATABASE_ID`

## CLAUDE.md

The root `CLAUDE.md` file is the Claude Code development guide. It stays at the project root (required by Claude Code) and is also synced to Notion.

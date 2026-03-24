/**
 * Docs manifest — maps markdown files to Notion page metadata.
 * slug is the unique key used for idempotent sync (update, not duplicate).
 */

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
export const NOTION_TOKEN = process.env.NOTION_TOKEN;

export const DOCS_MANIFEST = [
  // English
  { path: 'docs/en/rag-architecture.md', slug: 'rag-architecture-en', language: 'EN', category: 'architecture' },
  { path: 'docs/en/seo-geo-guide.md',    slug: 'seo-geo-guide-en',    language: 'EN', category: 'strategy' },
  { path: 'docs/en/dev-guide.md',        slug: 'dev-guide-en',        language: 'EN', category: 'guide' },
  { path: 'docs/en/feature-backlog.md',  slug: 'feature-backlog-en',  language: 'EN', category: 'backlog' },
  { path: 'docs/en/env-setup.md',        slug: 'env-setup-en',        language: 'EN', category: 'guide' },

  // Korean
  { path: 'docs/ko/rag-architecture.md', slug: 'rag-architecture-ko', language: 'KO', category: 'architecture' },
  { path: 'docs/ko/seo-geo-guide.md',    slug: 'seo-geo-guide-ko',    language: 'KO', category: 'strategy' },
  { path: 'docs/ko/dev-guide.md',        slug: 'dev-guide-ko',        language: 'KO', category: 'guide' },
  { path: 'docs/ko/feature-backlog.md',  slug: 'feature-backlog-ko',  language: 'KO', category: 'backlog' },
  { path: 'docs/ko/env-setup.md',        slug: 'env-setup-ko',        language: 'KO', category: 'guide' },

  // CLAUDE.md — special case, read from root
  { path: 'CLAUDE.md', slug: 'claude-md', language: 'KO', category: 'guide' },
];

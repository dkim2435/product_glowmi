/**
 * Glowmi Docs → Notion Sync
 *
 * Reads markdown files listed in config.mjs, converts them to Notion blocks,
 * and creates or updates pages in a Notion database.
 *
 * Usage:
 *   NOTION_TOKEN=xxx NOTION_DATABASE_ID=yyy node docs/notion-sync/sync.mjs
 *
 * Required env vars:
 *   NOTION_TOKEN        — Notion internal integration token
 *   NOTION_DATABASE_ID  — Target Notion database ID
 */

import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DOCS_MANIFEST, NOTION_DATABASE_ID, NOTION_TOKEN } from './config.mjs';
import { markdownToBlocks, parseFrontmatter } from './markdown-to-blocks.mjs';

// ── Validation ──────────────────────────────────────────────────────

if (!NOTION_TOKEN) {
  console.error('❌ NOTION_TOKEN is not set');
  process.exit(1);
}
if (!NOTION_DATABASE_ID) {
  console.error('❌ NOTION_DATABASE_ID is not set');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// Rate limit: Notion allows ~3 req/sec
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Find existing page by slug in the database.
 */
async function findPageBySlug(slug) {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  });
  return response.results[0] || null;
}

/**
 * Delete all child blocks of a page (for idempotent update).
 */
async function clearPageContent(pageId) {
  const children = await notion.blocks.children.list({ block_id: pageId, page_size: 100 });

  for (const block of children.results) {
    await notion.blocks.delete({ block_id: block.id });
    await delay(350); // rate limit
  }
}

/**
 * Append blocks in batches of 100 (Notion API limit).
 */
async function appendBlocks(pageId, blocks) {
  for (let i = 0; i < blocks.length; i += 100) {
    const batch = blocks.slice(i, i + 100);
    await notion.blocks.children.append({
      block_id: pageId,
      children: batch,
    });
    await delay(350);
  }
}

/**
 * Build Notion page properties from doc metadata.
 */
function buildProperties(meta, doc) {
  return {
    Title: {
      title: [{ text: { content: meta.title || doc.slug } }],
    },
    Language: {
      select: { name: doc.language },
    },
    Category: {
      select: { name: doc.category },
    },
    Slug: {
      rich_text: [{ text: { content: doc.slug } }],
    },
    'Last Synced': {
      date: { start: new Date().toISOString() },
    },
    'Source Path': {
      rich_text: [{ text: { content: doc.path } }],
    },
  };
}

// ── Main sync ───────────────────────────────────────────────────────

async function syncDoc(doc) {
  // Resolve path relative to project root
  const projectRoot = resolve(import.meta.dirname, '..', '..');
  const filePath = resolve(projectRoot, doc.path);

  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.warn(`⚠️  Skipping ${doc.path} — file not found`);
    return;
  }

  const meta = parseFrontmatter(content);
  // For CLAUDE.md which has no frontmatter, use slug as title
  if (!meta.title) meta.title = doc.slug;

  const blocks = markdownToBlocks(content);
  const properties = buildProperties(meta, doc);

  // Check if page already exists
  const existingPage = await findPageBySlug(doc.slug);
  await delay(350);

  if (existingPage) {
    // Update: clear old content, update properties, append new content
    console.log(`🔄 Updating: ${doc.path} (${doc.slug})`);
    await notion.pages.update({ page_id: existingPage.id, properties });
    await delay(350);
    await clearPageContent(existingPage.id);
    await appendBlocks(existingPage.id, blocks);
  } else {
    // Create new page
    console.log(`✨ Creating: ${doc.path} (${doc.slug})`);

    // Notion API: can include up to 100 children on create
    const firstBatch = blocks.slice(0, 100);
    const remaining = blocks.slice(100);

    const newPage = await notion.pages.create({
      parent: { database_id: NOTION_DATABASE_ID },
      properties,
      children: firstBatch,
    });
    await delay(350);

    if (remaining.length > 0) {
      await appendBlocks(newPage.id, remaining);
    }
  }
}

async function main() {
  console.log(`\n📚 Glowmi Docs → Notion Sync`);
  console.log(`   Database: ${NOTION_DATABASE_ID}`);
  console.log(`   Documents: ${DOCS_MANIFEST.length}\n`);

  let success = 0;
  let failed = 0;

  for (const doc of DOCS_MANIFEST) {
    try {
      await syncDoc(doc);
      success++;
    } catch (err) {
      console.error(`❌ Failed: ${doc.path} — ${err.message}`);
      failed++;
    }
    await delay(500); // extra breathing room between docs
  }

  console.log(`\n✅ Done: ${success} synced, ${failed} failed\n`);

  if (failed > 0) process.exit(1);
}

main();

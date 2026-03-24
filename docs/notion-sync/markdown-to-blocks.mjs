/**
 * Converts markdown text to Notion API block objects.
 *
 * Supported: headings (h1-h3), paragraphs, code blocks (incl. mermaid),
 * tables, bulleted lists, numbered lists, horizontal rules.
 * Inline: bold, italic, inline code, links.
 */

const MAX_TEXT_LENGTH = 2000; // Notion rich_text limit per segment

// ── Inline text parsing ─────────────────────────────────────────────

function parseInlineText(text) {
  const segments = [];
  // Regex matches: **bold**, *italic*, `code`, [text](url)
  const re = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = re.exec(text)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      segments.push(...splitRichText(text.slice(lastIndex, match.index), {}));
    }

    if (match[1]) {
      // **bold**
      segments.push(...splitRichText(match[2], { bold: true }));
    } else if (match[3]) {
      // *italic*
      segments.push(...splitRichText(match[4], { italic: true }));
    } else if (match[5]) {
      // `code`
      segments.push(...splitRichText(match[6], { code: true }));
    } else if (match[7]) {
      // [text](url)
      segments.push({ type: 'text', text: { content: match[8], link: { url: match[9] } }, annotations: {} });
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    segments.push(...splitRichText(text.slice(lastIndex), {}));
  }

  return segments.length > 0 ? segments : [{ type: 'text', text: { content: text }, annotations: {} }];
}

function splitRichText(content, annotations) {
  const chunks = [];
  for (let i = 0; i < content.length; i += MAX_TEXT_LENGTH) {
    chunks.push({
      type: 'text',
      text: { content: content.slice(i, i + MAX_TEXT_LENGTH) },
      annotations,
    });
  }
  return chunks;
}

// ── Table parsing ───────────────────────────────────────────────────

function parseTableRows(lines) {
  return lines
    .filter(line => !line.match(/^\|[\s-:|]+\|$/)) // skip separator row
    .map(line =>
      line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map(cell => cell.trim())
    );
}

function tableToBlocks(rows) {
  if (rows.length === 0) return [];
  const width = rows[0].length;

  const tableBlock = {
    object: 'block',
    type: 'table',
    table: {
      table_width: width,
      has_column_header: true,
      has_row_header: false,
      children: rows.map(row => ({
        object: 'block',
        type: 'table_row',
        table_row: {
          cells: row.map(cell => parseInlineText(cell)),
        },
      })),
    },
  };

  return [tableBlock];
}

// ── Main converter ──────────────────────────────────────────────────

export function markdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let i = 0;

  // Skip frontmatter
  if (lines[0] && lines[0].trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    i++; // skip closing ---
  }

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim().match(/^(-{3,}|\*{3,}|_{3,})$/)) {
      blocks.push({ object: 'block', type: 'divider', divider: {} });
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const type = `heading_${level}`;
      blocks.push({
        object: 'block',
        type,
        [type]: { rich_text: parseInlineText(headingMatch[2]) },
      });
      i++;
      continue;
    }

    // Code block (including mermaid)
    const codeMatch = line.match(/^```(\w*)$/);
    if (codeMatch) {
      const language = codeMatch[1] || 'plain text';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```$/)) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      const content = codeLines.join('\n');
      // Notion language mapping
      const langMap = {
        mermaid: 'mermaid',
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        bash: 'bash',
        sh: 'bash',
        sql: 'sql',
        json: 'json',
        yaml: 'yaml',
        yml: 'yaml',
        css: 'css',
        html: 'html',
        python: 'python',
        py: 'python',
      };

      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: splitRichText(content, {}),
          language: langMap[language] || 'plain text',
        },
      });
      continue;
    }

    // Table
    if (line.match(/^\|.+\|$/)) {
      const tableLines = [];
      while (i < lines.length && lines[i].match(/^\|.+\|$/)) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = parseTableRows(tableLines);
      blocks.push(...tableToBlocks(rows));
      continue;
    }

    // Bulleted list
    if (line.match(/^[-*]\s+/)) {
      const text = line.replace(/^[-*]\s+/, '');
      // Handle checkbox items
      const checkMatch = text.match(/^\[([ x])\]\s+(.+)$/);
      if (checkMatch) {
        blocks.push({
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: parseInlineText(checkMatch[2]),
            checked: checkMatch[1] === 'x',
          },
        });
      } else {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: { rich_text: parseInlineText(text) },
        });
      }
      i++;
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numMatch) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: parseInlineText(numMatch[1]) },
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.match(/^>\s*/)) {
      const text = line.replace(/^>\s*/, '');
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: parseInlineText(text) },
      });
      i++;
      continue;
    }

    // Default: paragraph
    blocks.push({
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: parseInlineText(line) },
    });
    i++;
  }

  return blocks;
}

/**
 * Parse frontmatter from markdown content.
 * Returns { title, slug, language, category, content }
 */
export function parseFrontmatter(markdown) {
  const lines = markdown.split('\n');
  const meta = {};

  if (lines[0] && lines[0].trim() === '---') {
    let i = 1;
    while (i < lines.length && lines[i].trim() !== '---') {
      const match = lines[i].match(/^(\w+):\s*(.+)$/);
      if (match) meta[match[1]] = match[2].trim();
      i++;
    }
  }

  return meta;
}

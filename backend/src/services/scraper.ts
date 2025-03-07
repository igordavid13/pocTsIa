import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

// Identify in markdown where each product begins and ends using
// regex following the pattern [name](/products/slug)
export function splitMarkdownByProductSlug(markdown: string): string[] {
  const productRegex = /\[.*?\]\(\/products\/([^)\s]+)\)/g;
  const indices: { slug: string; index: number }[] = [];
  
  let match: RegExpExecArray | null;
  while ((match = productRegex.exec(markdown)) !== null) {
    indices.push({ slug: match[1], index: match.index });
  }

  if (indices.length === 0) {
    return [markdown];
  }

  const chunks: string[] = [];
  let chunkStart = 0;
  let lastSlug = indices[0].slug;

  for (let i = 1; i < indices.length; i++) {
    const current = indices[i];
    if (current.slug !== lastSlug) {
      chunks.push(markdown.slice(chunkStart, current.index));
      chunkStart = current.index;
      lastSlug = current.slug;
    }
  }
  chunks.push(markdown.slice(chunkStart));
  return chunks;
}


// Cleans up HTML by removing unnecessary tags and elements.
export function cleanDOM(html: string): string {
  const $ = cheerio.load(html);

  // Remove unnecessary tags
  $('script, style, meta, link, header, footer, nav, aside').remove();

  // Remove comments
  $('*').contents().each((_, el) => {
    if (el.type === 'comment') {
      $(el).remove();
    }
  });

  // Remove inputs 
  $('input').each((_, el) => {
    const type = $(el).attr('type');
    const name = $(el).attr('name');
    if (type === 'text' || type === 'password' || (name && name.toLowerCase().includes('search'))) {
      $(el).remove();
    }
  });

  let cleanedHTML = $.html();
  cleanedHTML = cleanedHTML.replace(/^\s*[\r\n]/gm, '');
  return cleanedHTML;
}

// Converts clean HTML to markdown and splits it into chunks by product.
export function convertDOMToMarkdown(html: string): string[] {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);
  const productChunks = splitMarkdownByProductSlug(markdown);

  productChunks.forEach((chunk, index) => {
    console.log(`Chunk ${index + 1}:\n${chunk}\n`);
  });

  return productChunks;
}

// Function used for debug
export function writeToFile(contents: string[], fileName: string = 'cleaned.txt'): void {
  const outputDir = path.resolve(__dirname, '../../dist');
  const outputPath = path.join(outputDir, fileName);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const finalContent = contents
    .map((chunk, index) => `Chunk ${index + 1}:\n\n${chunk}`)
    .join('\n\n');

  fs.writeFileSync(outputPath, finalContent, { encoding: 'utf-8' });
  console.log(`File saved in: ${outputPath}`);
}

export async function scrape(url: string): Promise<string[]> {
  try {
    const { data: html } = await axios.get(url);
    const cleanedHTML = cleanDOM(html);
    const markdown = convertDOMToMarkdown(cleanedHTML);

    return markdown;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export function getChunks(markdown: string[], chunksIndex: number): string {
  // Checks if the index is out of bounds
  if (markdown.length <= chunksIndex) {
    return '';
  }

  // Returns the next 5 chunks
  return markdown.slice(chunksIndex, chunksIndex + 5).join('\n');
}
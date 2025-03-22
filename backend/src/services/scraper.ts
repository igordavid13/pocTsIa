import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';
import { encode, decode } from 'gpt-3-encoder';
import { scrapeProduct } from './scraper_products';

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
  try{
  const $ = cheerio.load(html);

  const mainContent = $('body > main').html();

    //console.log(mainContent);
    if (!mainContent) {
      throw new Error("Não foi possível encontrar conteúdo na tag <main>.");
    }
    const cleanedContent = cheerio.load(mainContent);

  // Remove unnecessary tags
  cleanedContent('iframe, path, script, style, meta, link, header, footer, nav, aside').remove();

  // Remove comments
  cleanedContent('*').contents().each((_, el) => {
    if (el.type === 'comment') {
      $(el).remove();
    }
  });

  // Remove inputs 
  cleanedContent('input').each((_, el) => {
    const type = $(el).attr('type');
    const name = $(el).attr('name');
    if (type === 'text' || type === 'password' || (name && name.toLowerCase().includes('search'))) {
      cleanedContent(el).remove();
    }
  });

  let cleanedHTML = cleanedContent.html();
  cleanedHTML = cleanedHTML.replace(/^\s*[\r\n]/gm, '');
  return cleanedHTML;
  } catch (error) {
    return '';
  }
}

// Converts clean HTML to markdown and splits it into chunks by product.
export function convertDOMToMarkdown(html: string): string[] {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);
  const productChunks = splitMarkdownByProductSlug(markdown);

  // productChunks.forEach((chunk, index) => {
  //   console.log(`Chunk ${index + 1}:\n${chunk}\n`);
  // });

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

// Not used in the final implementation, from version 1
export function getChunks(markdown: string[], chunksIndex: number): string {
  // Checks if the index is out of bounds
  if (markdown.length <= chunksIndex) {
    return '';
  }
  return markdown.slice(chunksIndex, chunksIndex + 5).join('\n');
}

interface Product {
  name: string;
  image: string;
  link: string;
}
export function limitMarkdown(markdown: string): string {
  const tokens = encode(markdown);
  
  if (tokens.length <= 8000) {
    return markdown;
  }

  const tokensLimit = tokens.slice(0, 8000);


  const markdownLimited = decode(tokensLimit);
  
  console.log(markdownLimited);
  return markdownLimited;
}

export async function processProducts(jsonString: string, originUrl: string) {
  const productsUnscrapped = JSON.parse(jsonString) as Product[];  
  let markdownString = ''; 
  let shiftedProductsJson: Product[] = [];  
  let totalTokens = 0;
  var productsScraped = 0;
  while (productsUnscrapped.length > 0) {
    const currentProduct = productsUnscrapped.shift();  
    productsScraped ++;

    if (!currentProduct) break;  
    
    // Checks if the product link is a full URL or a relative path and converts it to a full URL
    const fullUrl = currentProduct.link.startsWith("http")
        ? currentProduct.link
        : new URL(currentProduct.link, originUrl).href; 
 

    const productMarkdown = await scrapeProduct(fullUrl);  

    const productTokens = encode(productMarkdown).length;

    // Checks if the sum of the tokens of the products is within the limit and if the number of products is less than 5
    // for api AI purposes
    if (totalTokens + productTokens <= 8000 && productsScraped <= 5) {
      markdownString += productMarkdown;
      shiftedProductsJson.push(currentProduct);
      totalTokens += productTokens; 
    } else {
      productsUnscrapped.unshift(currentProduct);
      break;
    }
  }

  return {
    markdownString,         
    shiftedProductsJson,     
    productsUnscrapped   
  };
}
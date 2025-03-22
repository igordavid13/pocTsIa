import axios from "axios";
import * as cheerio from 'cheerio';
import TurndownService from "turndown";


function extractProductName(url: string): string {
  const regex = /\/products\/([^\/?]+)/;
  const match = url.match(regex);
  if (match) {
    const productName = match[1];
    // replaces '-' with ' ' and checks if there is a number in the product name
    return /\d/.test(productName) ? productName : productName.replace(/-/g, " ");
  }
  return "";
}


function filterProductMarkdown(markdown: string, productName: string): string {
  const productSectionStartRegex = new RegExp(`([\\s\\S]*?${productName}[\\s\\S]*?)((?=\\n\\s*#|$))`, "i");
  const matches = markdown.match(productSectionStartRegex);
  if (matches && matches.length > 0) {
    let filteredContent = matches[0].trim();
    filteredContent = filteredContent.replace(/^\s*[\r\n]/gm, "");
    // Remove all links (http://, https://, www, mailto, etc)
    filteredContent = filteredContent.replace(/(?:https?:\/\/|www\.|mailto:)[^\s]+/g, '');
    // Remove images in the format ![alt-text](image-url)
    filteredContent = filteredContent.replace(/!\[.*?\]\(.*?\)/g, '');
    // Remove link in the pattern [link-text](#)
    filteredContent = filteredContent.replace(/\[.*?\]\(.*?\)/g, '');

    return filteredContent.trim();
  }
  return "Product not find in the markdown";
}

export async function scrapeProduct(url: string): Promise<string> {
  try {

    const { data:html } = await axios.get(url);

    // 2. Carregar o HTML da página com Cheerio
    let $ = cheerio.load(html);
    const mainContent = $("body > main").html();
    if (!mainContent) {
      throw new Error("Não foi possível encontrar conteúdo na tag <main>.");
    }
    const cleanedContent = cheerio.load(mainContent);
    cleanedContent("script, style, iframe, path, link, footer").remove();

    const productName = extractProductName(url);

    const cleanedHTML = cleanedContent.html() || "";

    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(cleanedHTML);

    const filteredMarkdown = filterProductMarkdown(markdownContent, productName);

    return filteredMarkdown;
  } catch (error) {
    console.error("Erro ao fazer o scraping do produto:", error);
    throw error;
  }
}
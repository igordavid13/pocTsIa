import express, { Request, Response } from 'express';
import { scrape, getChunks,limitMarkdown, processProducts } from './services/scraper';
import { iaInfoProducts, iaGetPage } from './services/openaiService';
import cors from 'cors'; 

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


app.post('/scrape', async (req: Request, res: Response) => {
  const { url } = req.body;
  
  try {
    if(!url) {
      throw new Error('URL is required');
    }
   
    const markdown = await scrape(url);
    if (markdown) {
      // Scrape function returns an array os strings, in this function we join all the strings in one, redundance from the first version
      const all_products_json:string = await iaGetPage(limitMarkdown(markdown.join('\n')));
      console.log('all_products_json:', all_products_json);
      
      let parsedUrl = new URL(url);
      const urlBase = (`${parsedUrl.protocol}//${parsedUrl.host}`).toString();

      var {markdownString, shiftedProductsJson, productsUnscrapped} = await processProducts(all_products_json, urlBase);

      markdownString += JSON.stringify(shiftedProductsJson);
      console.log(markdownString);
      const json_result = await iaInfoProducts(markdownString);

      console.log('productsUnscrapped:', productsUnscrapped);

      if (json_result) {
        res.json({json_result, productsUnscrapped});
      } else {
        res.status(400).json({ error: 'No data found for the given URL' });
      }
    }
    }
    catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/scrape-more', async (req: Request, res: Response) => {
  let { url, products } = req.body;
  try {
    if(!url) {
      throw new Error('URL is required');
      
    }
    let parsedUrl = new URL(url);
    const urlBase = (`${parsedUrl.protocol}//${parsedUrl.host}`).toString();

    var {markdownString, shiftedProductsJson, productsUnscrapped} = await processProducts(JSON.stringify(products), urlBase);

    markdownString += JSON.stringify(shiftedProductsJson);
    console.log(markdownString);
    const json_result = await iaInfoProducts(markdownString);

    console.log('products:', productsUnscrapped);

    if (json_result) {
      res.json({json_result, productsUnscrapped});
    } else {
      res.status(400).json({ error: 'No data found for the given URL' });
    }
  }
  catch (error) {
    res.status(500).json({ error: 'Error fetching more data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// const url = 'https://carletonequipment.com/collections/used-equipment';
// const url = 'https://www.thesill.com/'
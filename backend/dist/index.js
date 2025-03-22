"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scraper_1 = require("./services/scraper");
const openaiService_1 = require("./services/openaiService");
const cors_1 = __importDefault(require("cors"));
// Inicializa o servidor Express
const app = (0, express_1.default)();
const port = 5000;
// Middleware para ler JSON nas requisições
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rota para o scraping inicial
app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    //Validar se recebo url
    try {
        if (!url) {
            throw new Error('URL is required');
        }
        // Inicia o scraping da URL fornecida
        const markdown = await (0, scraper_1.scrape)(url);
        // const markdownContent = getChunks(markdown, 0);
        if (markdown) {
            const all_products_json = await (0, openaiService_1.iaGetPage)((0, scraper_1.limitMarkdown)(markdown.join('\n')));
            let parsedUrl = new URL(url);
            const urlBase = (`${parsedUrl.protocol}//${parsedUrl.host}`).toString();
            console.log(urlBase);
            const { markdownString, shiftedProductsJson } = await (0, scraper_1.processProducts)(all_products_json, urlBase);
            console.log("Markdown gerado dos produtos:\n", markdownString);
            console.log("Produtos processados (shiftados):\n", shiftedProductsJson);
            if (all_products_json) {
                res.json(all_products_json);
            }
            else {
                res.status(400).json({ error: 'No data found for the given URL' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Rota para carregar mais dados
app.post('/scrape-more', async (req, res) => {
    const { url, currentCount } = req.body;
    try {
        // Realiza o scraping e retorna mais produtos
        const markdown = await (0, scraper_1.scrape)(url);
        const markdownContent = (0, scraper_1.getChunks)(markdown, currentCount);
        if (markdownContent) {
            var responseJson = await (0, openaiService_1.iaInfoProducts)(markdownContent);
            if (responseJson) {
                res.json(responseJson);
            }
            else {
                res.status(404).json({ error: 'No more data available' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching more data' });
    }
});
// Inicializa o servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
// const url = 'https://www.bollandbranch.com/collections/pillows-protectors/?direction=next&cursor=eyJsYXN0X2lkIjo3MzI0NTA2Njg1NDk5LCJsYXN0X3ZhbHVlIjoyMn0%3D';
// const url = 'https://www.glossier.com/';
// const url = 'https://carletonequipment.com/collections/used-equipment';
// const url = 'https://www.thesill.com/'
//# sourceMappingURL=index.js.map
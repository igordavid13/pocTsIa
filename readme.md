# Product Web Scraping

This project aims to perform web scraping on static product sales websites. After scraping and identifying the products on the main page, the program returns a dynamic table with the extracted information from each product's individual page.

## Technologies Used

### Frontend

- **React**: JavaScript library for building user interfaces.
- **React-Router**: Library for managing client-side navigation and routing in React applications, allowing dynamic rendering of components based on URL changes.
- **Vite**: Build tool for fast and optimized development.
- **TypeScript (TSX)**: A superset of JavaScript with static typing.
- **CSS**: Stylesheets for layout and design.
- **Toastify**: Library for displaying elegant notifications.
- **React Icons**: Collection of icons for use with React.

### Backend

- **Axios**: HTTP client for making requests and fetching HTML.
- **Cheerio**: Library for parsing and manipulating HTML on the backend.
- **Express**: Framework for building the API.
- **OpenAI API**: Used to process and structure the extracted data.
- **Dotenv**: Loads environment variables from a `.env` file.
- **Turndown**: Converts HTML to Markdown.

## Project Workflow

1. **Frontend**:

   - The user requests a website scraping.
   - The frontend sends a POST request to the backend with the target URL.

2. **Backend**:

   - The backend fetches the website's HTML using `axios`.
   - The HTML is cleaned and converted to Markdown using the `turndown` library.
   - The Markdown is sent to the OpenAI API (using the GPT-4o model) to transform the data into a structured `JSON_ROOT` containing all the products from the page. Each product includes its name, link to its page, and image.
   - A loop iterates over the `JSON_ROOT` to scrape each product by converting it to Markdown. This continues until the token limit for an AI API request is reached or 5 products have been aggregated.
   - The aggregated Markdown of the filtered products is then sent to the AI API again to be transformed into JSON.
   - Finally, the JSON is returned to the frontend, containing the scraped product information as well as another JSON with the products that are yet to be scraped.

3. **Frontend (Continued)**:
   - The frontend displays the information in a dynamic table.
   - The user can request more data, which triggers a new request to the backend. This request includes the URL to be scraped and the list of products that have not yet been scraped. The backend then returns the next set of products or all available products by leveraging the saved and processed Markdown.

## How to Run

1. **Install Dependencies**:

   - In both the `frontend` and `backend` directories, install the project dependencies by running:
     ```bash
     npm install
     ```

2. **Run the Project**:

   - Open two terminal instances: one for the frontend and one for the backend.
   - In each terminal, start the project with:
     ```bash
     npm run dev
     ```

3. **Configure the OpenAI API**:
   - Create an account on the [OpenAI Playground](https://github.com/marketplace/models/azure-openai/gpt-4o/playground) and generate your API key (a free key allows up to 50 requests per day).
   - In the `.env` file within the `backend` folder, add your API key:
     ```bash
     OPENAI_API_KEY='Your_key'
     ```

## Sites for Testing

You can test the scraping on any of the following websites:

- [Carleton Equipment](https://carletonequipment.com/collections/used-equipment)
- [The Sill](https://www.thesill.com/)

## Areas for Improvement

1. **Axios Requests**:

   - The HTTP requests made using `axios` may not work on all websites, particularly those with security measures like CAPTCHAs, IP validation, login requirements, or pop-ups.
   - **Potential Solution**: Consider exploring paid tools or advanced techniques to bypass these checks.

2. **HTML Cleaning**:

   - The current method for cleaning the HTML may not be effective for highly dynamic websites.
   - **Potential Solution**: Explore alternative strategies or more robust tools for cleaning HTML classes and elements.

3. **Product Identification**:

   - The method used to identify products and form content chunks may not work perfectly for every website.
   - **Potential Solution**: Implement a preliminary pass using the AI API by sending the raw Markdown and requesting a regular expression tailored to the site. This regex can help better identify the products, after which the Markdown can be processed more effectively.

4. **URL Pattern Limitation**:
   - Note: The scraper only works for sites whose URLs follow the pattern `www.productsite/products/productabcde/...`.

## Contributions

Contributions are welcome! If you have suggestions, improvements, or fixes, feel free to open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

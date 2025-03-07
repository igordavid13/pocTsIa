# Product Web Scraping

This project aims to perform scraping of static product sales websites. After scraping and identifying the products, the program returns a dynamic table with the extracted information.

## Technologies Used

### Frontend:
- **React**: JavaScript library for building user interfaces.
- **Vite**: A build tool that enables fast and optimized development.
- **TypeScript (TSX)**: A superset of JavaScript that adds static typing.
- **CSS**: Stylesheets for layout construction.
- **Socket.IO (client)**: Library for real-time communication over WebSockets.
- **Toastify**: Library to display elegant notifications.
- **React Icons**: A set of icons for use with React.

### Backend:
- **Socket.IO (server)**: For real-time communication with the frontend via WebSockets.
- **Axios**: HTTP client to make requests and fetch HTML.
- **Cheerio**: Library for manipulating and parsing HTML on the backend.
- **Express**: Framework for building the API.
- **OpenAI API**: Used to process and structure the extracted data.
- **Dotenv**: For loading environment variables from a `.env` file.
- **Turndown**: Library to convert HTML to Markdown.

## Project Workflow

1. **Frontend**:
   - The user requests the scraping of a website.
   - The frontend sends the request to the backend via WebSocket (Socket.IO).
   
2. **Backend**:
   - The backend makes an HTTP request to fetch the site's HTML using `axios`.
   - The HTML is cleaned and converted to Markdown using the `turndown` library.
   - The Markdown is processed into "chunks" (blocks of text), each representing a product, using regular expressions to identify product patterns like `[name](/products/slug)`.
   - Five chunks are grouped together and sent to the OpenAI API using the GPT-4o model to transform the data into structured JSON.
   - The JSON is returned to the frontend with the product information.

3. **Frontend (Continued)**:
   - The frontend displays the information in a dynamic table.
   - The user can request more data, which triggers a new request to the backend, returning the next products or all available products, leveraging the saved and processed Markdown.

## How to Run

1. **Install Dependencies**:
   - In both the `frontend` and `backend` directories, install the project dependencies by running:
     ```bash
     npm install
     ```

2. **Run the Project**:
   - Open two terminal instances: one for the frontend and one for the backend.
   - In each terminal, run the following command to start the project:
     ```bash
     npm run dev
     ```

3. **Configure the OpenAI API**:
   - Create an account on the [OpenAI Playground](https://github.com/marketplace/models/azure-openai/gpt-4o/playground) and generate your API key. You can get a free key with 50 requests per day.
   - In the `.env` file within the `backend` folder, add your API key:
     ```bash
     OPENAI_API_KEY='Your_key'
     ```

## Sites for Testing

You can test the scraping on any of the following websites:

- [Boll & Branch](https://www.bollandbranch.com/collections/pillows-protectors/?direction=next&cursor=eyJsYXN0X2lkIjo3MzI0NTA2Njg1NDk5LCJsYXN0X3ZhbHVlIjoyMn0%3D)
- [Glossier](https://www.glossier.com/)
- [Carleton Equipment](https://carletonequipment.com/collections/used-equipment)
- [The Sill](https://www.thesill.com/)

## Areas for Improvement

1. **Axios Requests**:
   - The HTTP request using `axios` may not work on all websites, especially those with security measures such as captchas, IP validation, login requirements, or pop-ups.
   - **Solution**: Explore paid tools or advanced techniques to bypass these checks.

2. **HTML Cleaning**:
   - The current method for cleaning the HTML is not efficient for highly dynamic websites.
   - **Solution**: Explore alternative strategies to clean HTML classes or use more robust tools.

3. **Product Identification**:
   - The identification of products and chunk formation is not entirely effective for all websites.
   - **Solution**: Perform a first pass through the AI API, sending the raw Markdown and requesting a regular expression (regex) specific to the site, to properly identify products. After that, the Markdown can be processed more efficiently.

4. **Loading Button Position**:
   - The loading button may disappear when the table increases in size.
   - **Solution**: Adjust the layout to ensure the loading button remains visible during the loading process.

## Contributions

Contributions are welcome! If you have suggestions, improvements, or fixes, feel free to open a *pull request*.

## License

This project is licensed under the [MIT License](LICENSE).

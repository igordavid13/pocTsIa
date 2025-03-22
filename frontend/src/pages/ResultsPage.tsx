import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Table from "../components/Table";
import Button from "../components/Button";
import TableFilters from "../components/TableFilters"; // Importando os filtros
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState(location.state?.products || []);
  const [jsonResult, setJsonResult] = useState(
    location.state?.json_result || []
  );
  const [loadingMore, setLoadingMore] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const url = queryParams.get("url");

  useEffect(() => {
    if (!url) {
      console.error("URL não encontrada!");
      return;
    }
  }, [url]);

  const handleLoadMore = async () => {
    if (!url) return;

    setLoadingMore(true);
    try {
      // console.log("Enviando para o backend:", { url, products });

      const response = await axios.post("http://localhost:5000/scrape-more", {
        url,
        products,
      });

      // Updates the jsons with the backend response
      setProducts(response.data.productsUnscrapped);
      setJsonResult([...jsonResult, ...response.data.json_result]);

      // If there are no more products to be scrapped changes the button text to "Go to Homepage"
      if (response.data.productsUnscrapped.length === 0) {
        toast.warning("Nenhum produto encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar mais produtos", error);
      toast.error("Erro ao carregar mais produtos");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Produtos Encontrados</h1>
      <TableFilters data={jsonResult} onSort={setProducts} />
      <Table data={jsonResult} />
      {products.length === 0 ? (
        <button className="button" onClick={handleGoToHomepage}>
          Go to Homepage
        </button>
      ) : (
        <Button
          onClick={handleLoadMore}
          loading={loadingMore}
          name="LoadingMore"
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default ResultsPage;

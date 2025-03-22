import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UrlInput from "../components/UrlInput";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/HomePage.css";
import Button from "../components/Button";

const HomePage: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (loading) return;

    if (url.trim()) {
      setLoading(true);

      try {
        const response = await axios.post("http://localhost:5000/scrape", {
          url,
        });
        navigate(`/results?url=${encodeURIComponent(url)}`, {
          // State saves the data to be used in the next page
          state: {
            json_result: response.data.json_result,
            products: response.data.productsUnscrapped,
          },
        });
      } catch (error) {
        console.error("Erro ao fazer scraping", error);
        toast.error("Erro ao fazer scraping");
      } finally {
        setLoading(false);
      }
    } else {
      toast.warning("Please, insert a valid URL.");
    }
  };

  return (
    <div className="container">
      <h1>Products WebScrapper</h1>
      <UrlInput onChange={setUrl} />
      <div className="button-group">
        <Button onClick={handleSearch} loading={loading} name="Search" />
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
    </div>
  );
};

export default HomePage;

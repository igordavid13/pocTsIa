import React, { useState, useEffect, useRef } from "react";
import UrlInput from "./components/UrlInput";
import DataTable from "./components/Table";
import Loading from "./components/Loading";
import TableFilters from "./components/TableFilters";
import { socket, sendUrl, requestMoreData } from "./socket";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/App.css";

// Flexible data type for the json data
interface DataItem {
  [key: string]: any;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const isLoadMoreRef = useRef<boolean>(false);

  useEffect(() => {
    // Conect to the WebSocket server and listen for data
    socket.on("jsonData", (jsonData: DataItem[]) => {
      if (isLoadMoreRef.current) {
        setData((prevData) => [...prevData, ...jsonData]);
      } else {
        setData(jsonData);
      }
      setLoading(false);
      isLoadMoreRef.current = false;
    });

    // Errors returned from the backend
    socket.on("error", (error: any) => {
      console.error("Received Error:", error);
      setLoading(false);
      isLoadMoreRef.current = false;
      if (error === "URL") {
        toast.error("Unable to process URL!");
      } else if (error === "noData") {
        toast.error("No more data!");
      } else if (error === "gpt") {
        toast.error("GPT Error!");
      }
    });

    // Limpeza dos listeners ao desmontar o componente
    return () => {
      socket.off("jsonData");
      socket.off("error");
    };
  }, []);

  const handleSearch = () => {
    if (loading) {
      return;
    }

    if (url.trim()) {
      isLoadMoreRef.current = false;
      setData([]);
      setLoading(true);
      sendUrl(url);
    } else {
      toast.warning("Please, insert a valid URL.");
    }
  };

  const handleLoadMore = () => {
    isLoadMoreRef.current = true;
    setLoading(true);
    requestMoreData();
  };

  const handleSort = (sortedData: DataItem[]) => {
    setData(sortedData);
  };

  return (
    <div className="container">
      <h1>Products WebScrapper</h1>
      <UrlInput onChange={setUrl} />
      <div className="button-group">
        <button onClick={handleSearch} className="button">
          Search
        </button>
        <button onClick={handleLoadMore} className="button">
          Get More Data
        </button>
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
      {data.length > 0 && <TableFilters data={data} onSort={handleSort} />}
      {data.length > 0 && <DataTable data={data} />}
      {loading && <Loading />}
    </div>
  );
};

export default App;

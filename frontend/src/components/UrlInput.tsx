import { useState } from "react";
import "../css/UrlInput.css";

interface UrlInputProps {
  onChange: (value: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onChange }) => {
  const [url, setUrl] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="input-container">
      <input
        type="text"
        value={url}
        onChange={handleChange}
        placeholder="Insert the URL"
      />
    </div>
  );
};

export default UrlInput;

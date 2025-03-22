import React from "react";
import Loading from "./Loading";

interface ButtonProps {
  onClick: () => void;
  loading: boolean;
  name: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, loading, name }) => {
  return (
    <button onClick={onClick} disabled={loading} className="button">
      {loading ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Loading />
          <span style={{ marginLeft: "10px" }}>Loading...</span>
        </div>
      ) : (
        name
      )}
    </button>
  );
};

export default Button;

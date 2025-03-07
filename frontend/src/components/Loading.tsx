import React from "react";
import { ImSpinner3 } from "react-icons/im";

import "../css/Loading.css";

const Loading: React.FC = () => {
  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <ImSpinner3 size={42} className="spinner-icon" />
    </div>
  );
};

export default Loading;

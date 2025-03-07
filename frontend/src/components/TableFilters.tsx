import React from "react";
import "../css/TableFilters.css";

interface TableFiltersProps {
  data: any[];
  onSort: (sortedData: any[]) => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({ data, onSort }) => {
  // Generates a list of all unique keys in the data
  const allKeys = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );

  // Function to handle filter changes and order as "asc" or "desc"
  const handleFilterChange = (column: string, order: "asc" | "desc") => {
    const sorted = [...data].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      // Undefined values in the end
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;

      // If number
      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      // If strings
      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();
      if (strA < strB) return order === "asc" ? -1 : 1;
      if (strA > strB) return order === "asc" ? 1 : -1;
      return 0;
    });
    onSort(sorted);
  };

  const hasName = allKeys.includes("name");
  const hasPrice = allKeys.includes("price");
  const hasBrand = allKeys.includes("brand");

  return (
    <div className="filter-container">
      {hasName && (
        <div>
          <span>Name:</span>
          <button onClick={() => handleFilterChange("name", "asc")}>
            A → Z
          </button>
          <button onClick={() => handleFilterChange("name", "desc")}>
            Z → A
          </button>
        </div>
      )}

      {hasPrice && (
        <div>
          <span>Price:</span>
          <button onClick={() => handleFilterChange("price", "desc")}>
            High → Low
          </button>
          <button onClick={() => handleFilterChange("price", "asc")}>
            Low → High
          </button>
        </div>
      )}

      {hasBrand && (
        <div>
          <span>Brand:</span>
          <button onClick={() => handleFilterChange("brand", "asc")}>
            A → Z
          </button>
          <button onClick={() => handleFilterChange("brand", "desc")}>
            Z → A
          </button>
        </div>
      )}
    </div>
  );
};

export default TableFilters;

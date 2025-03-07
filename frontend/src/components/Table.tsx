import "../css/Table.css";

interface TableProps {
  data: any[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (data.length === 0) return null;

  // Get all unique keys
  const allKeys = Array.from(
    new Set(
      data.reduce((keys: string[], item) => keys.concat(Object.keys(item)), [])
    )
  );

  const isImageUrl = (value: string): boolean => {
    return /\.(jpeg|jpg|png|gif)(\?.*)?$/i.test(value);
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          {allKeys.map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {allKeys.map((key, i) => (
              <td key={i}>
                {item[key] !== undefined ? (
                  typeof item[key] === "string" && isImageUrl(item[key]) ? (
                    <img
                      src={item[key]}
                      alt={key}
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  ) : (
                    String(item[key])
                  )
                ) : (
                  ""
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

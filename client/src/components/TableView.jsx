const HIDDEN_COLUMNS = ["_id", "createdAt", "updatedAt", "__v", "userId"];

const TableView = ({ data }) => {
  if (data.length === 0) return null;

  const columns = Object.keys(data[0]).filter(
    (col) => !HIDDEN_COLUMNS.includes(col)
  );

  const totalRow = data.find(
    (row) => row.PROFILE?.toString().toLowerCase() === "total"
  );
  const normalRows = data.filter(
    (row) => row.PROFILE?.toString().toLowerCase() !== "total"
  );

  const formatValue = (value) => {
    if (typeof value === "number") return value.toFixed(2);
    return value;
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-2 min-w-full">
        <table className="min-w-full table-auto text-sm text-[#1E1E2D]">
          <thead>
            <tr className="bg-gray-100 border-b text-left">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 font-semibold tracking-wide capitalize"
                >
                  {col.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {normalRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 border-b last:border-none"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {formatValue(row[col])}
                  </td>
                ))}
              </tr>
            ))}

            {totalRow && (
              <tr className="bg-yellow-100 font-semibold">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {formatValue(totalRow[col])}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;

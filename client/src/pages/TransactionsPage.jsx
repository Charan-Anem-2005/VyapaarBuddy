import { useEffect, useState } from "react";
import {
  Store,
  CalendarDays,
  UserRound,
  Package,
  Ruler,
  Weight,
  IndianRupee,
  Download,
  Eye,
} from "lucide-react";
import API from "./Api";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await API.get(`/transactions/all`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(true);
    }
    setLoading(false);
  };

  const handleInvoiceDownload = async (transactionId) => {
    try {
      const response = await API.get(`/invoice/${transactionId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download invoice:", err);
    }
  };

  const handleInvoicePreview = (transactionId) => {
    const token = localStorage.getItem("token");
    const previewUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/invoice/${transactionId}/preview?token=${token}`;
    window.open(previewUrl, "_blank");
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 text-[#1E1E2D]">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Store className="text-[#fabd05]" /> All Transactions
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader border-4 border-gray-300 border-t-[#fabd05] rounded-full w-10 h-10 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <p>Failed to fetch transactions.</p>
          <button
            onClick={fetchTransactions}
            className="mt-2 px-4 py-2 bg-[#1E1E2D] text-white rounded hover:bg-[#2b2b53]"
          >
            Retry
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions available.</p>
      ) : (
        transactions.map((tx, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg mb-6 p-4 border-l-4 border-[#fabd05]"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3 text-lg font-semibold">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    tx.type === "Sold"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {tx.type}
                </span>
                <span className="text-gray-600 flex items-center gap-2 text-sm">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="text-right text-sm text-gray-600">
                <div className="flex items-center gap-2 justify-end">
                  <UserRound className="w-4 h-4" />
                  {tx.buyerInfo?.companyName || "N/A"}
                </div>
                <p>
                  Items: <strong>{tx.items.length}</strong> | Total:{" "}
                  <strong>₹{tx.totalAmount.toFixed(2)}</strong>
                </p>

                {tx.type === "Sold" && (
                  <div className="flex gap-2 mt-2 justify-end">
                    <button
                      className="flex items-center gap-1 text-sm px-3 py-1 bg-[#1E1E2D] text-white rounded hover:bg-[#2b2b53]"
                      onClick={() => handleInvoicePreview(tx._id)}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      className="flex items-center gap-1 text-sm px-3 py-1 bg-[#fabd05] text-black rounded hover:bg-yellow-400"
                      onClick={() => handleInvoiceDownload(tx._id)}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                )}
              </div>
            </div>

            <table className="w-full text-sm border-t border-gray-300">
              <thead className="bg-gray-100 text-[#1E1E2D]">
                <tr>
                  <th className="p-2 text-left flex items-center gap-1">
                    <Package className="w-4 h-4 text-[#fabd05]" /> Profile
                  </th>
                  <th className="p-2 text-right">
                    <Package className="w-4 h-4 inline text-[#fabd05]" /> Packs
                  </th>
                  <th className="p-2 text-right">
                    <Ruler className="w-4 h-4 inline text-[#fabd05]" /> Lengths
                  </th>
                  <th className="p-2 text-right">
                    <Weight className="w-4 h-4 inline text-[#fabd05]" /> Qty
                  </th>
                  <th className="p-2 text-right">
                    <IndianRupee className="w-4 h-4 inline text-[#fabd05]" />{" "}
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {tx.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="p-2">{item.PROFILE}</td>
                    <td className="p-2 text-right">
                      {parseFloat(item.soldPacks || 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      {parseFloat(item.soldLengths || 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      {parseFloat(item.soldQty || 0).toFixed(2)}
                    </td>
                    <td className="p-2 text-right">
                      ₹{parseFloat(item.soldAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionsPage;

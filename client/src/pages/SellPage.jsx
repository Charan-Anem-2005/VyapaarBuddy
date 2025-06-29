import { useState } from "react";
import { MinusCircle, UserRoundCheck, FileText } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

const SellPage = () => {
  const [items, setItems] = useState([
    { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "", WEIGHT: "" },
  ]);
  const [buyerInfo, setBuyerInfo] = useState({
    companyName: "",
    address: "",
    gstin: "",
    phone: "",
    vehicleNumber: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [soldItems, setSoldItems] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, e) => {
    const updated = [...items];
    updated[index][e.target.name] = e.target.value;
    setItems(updated);
  };

  const addRow = () =>
    setItems([
      ...items,
      { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "", WEIGHT: "" },
    ]);

  const removeRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const confirmSell = () => setShowConfirm(true);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post(`/sell`, {
        items,
        buyerInfo,
      });
      toast.success("Sell successful");
      setTotalAmount(res.data.totalAmount || 0);
      setSoldItems(res.data.soldItems || []);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error during sell operation");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const res = await API.post(
        `/invoice/generate`,
        { items: soldItems, buyer: buyerInfo },
        { responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      link.click();
    } catch (error) {
      console.error("Invoice generation failed:", error);
      toast.error("Invoice generation failed");
    }
  };

  return (
    <div className="p-6 text-[#1E1E2D]">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MinusCircle className="text-[#fabd05]" /> Sell Materials (Multiple)
      </h2>

      {/* Buyer Info */}
      <div className="mb-6 bg-white border-l-4 border-[#fabd05] rounded-lg p-4 shadow-sm">
        <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
          <UserRoundCheck className="text-[#fabd05]" size={18} />
          Buyer / Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: "companyName", label: "Buyer Name" },
            { key: "address", label: "Address" },
            { key: "gstin", label: "GSTIN" },
            { key: "phone", label: "Phone" },
            { key: "vehicleNumber", label: "Vehicle Number" },
          ].map(({ key, label }) => (
            <input
              key={key}
              type="text"
              name={key}
              placeholder={label}
              value={buyerInfo[key] || ""}
              onChange={(e) =>
                setBuyerInfo({ ...buyerInfo, [key]: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          ))}
        </div>
      </div>

      {/* Item Fields */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded shadow-sm bg-white"
          >
            <div className="flex flex-wrap gap-2">
              {["PROFILE", "PACKS", "LENGTHS", "QTY", "WEIGHT"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={item[field]}
                  onChange={(e) => handleChange(index, e)}
                  className="border px-3 py-2 rounded w-32"
                />
              ))}
              {items.length > 1 && (
                <button
                  onClick={() => removeRow(index)}
                  className="ml-2 text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={addRow}
          className="bg-[#1E1E2D] text-white px-4 py-2 rounded hover:bg-[#2b2b53]"
        >
          + Add Row
        </button>
        <button
          onClick={confirmSell}
          className="bg-[#fabd05] text-[#1E1E2D] px-4 py-2 rounded hover:bg-yellow-400"
          disabled={loading}
        >
          {loading ? "Processing..." : "Sell All"}
        </button>
      </div>

      {/* Totals */}
      {totalAmount > 0 && (
        <>
          <p className="font-semibold text-green-700 mt-4">
            Total Amount: ₹{totalAmount.toFixed(2)}
          </p>
          <button
            onClick={handleDownloadInvoice}
            className="mt-3 bg-[#1E1E2D] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-[#2b2b53]"
          >
            <FileText className="text-[#fabd05]" size={18} />
            Download Invoice
          </button>
        </>
      )}

      {/* Confirmation Modal */}
      {showConfirm && !loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#1E1E2D]">
              Confirm Sell
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to proceed with selling?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#1E1E2D] text-white rounded"
              >
                Yes, Sell
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loader Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="loader border-4 border-gray-300 border-t-[#fabd05] rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SellPage;

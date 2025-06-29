import { useState } from "react";
import { PlusCircle, UserRoundCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

const BuyPage = () => {
  const [items, setItems] = useState([
    { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "", WEIGHT: "" },
  ]);
  const [buyerInfo, setBuyerInfo] = useState({
    companyName: "",
    address: "",
    gstin: "",
    phone: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const confirmBuy = () => setShowConfirm(true);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await API.post(`/buy`, { items, buyerInfo });
      toast.success("Buy successful");
      setTotalAmount(res.data.totalAmount || 0);
      setItems([{ PROFILE: "", PACKS: "", LENGTHS: "", QTY: "", WEIGHT: "" }]);
    } catch (err) {
      console.error(err);
      toast.error("Error during buy operation");
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-6 text-[#1E1E2D]">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="text-[#fabd05]" /> Buy Materials (Multiple)
      </h2>

      {/* Buyer Info */}
      <div className="mb-6 bg-white border-l-4 border-[#fabd05] rounded-lg p-4 shadow-sm">
        <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
          <UserRoundCheck className="text-[#fabd05]" size={18} />
          Vendor / Customer Details
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Vendor Company Name"
            value={buyerInfo.companyName}
            onChange={(e) =>
              setBuyerInfo({ ...buyerInfo, companyName: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Vendor Address"
            value={buyerInfo.address}
            onChange={(e) =>
              setBuyerInfo({ ...buyerInfo, address: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="GSTIN"
            value={buyerInfo.gstin}
            onChange={(e) =>
              setBuyerInfo({ ...buyerInfo, gstin: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={buyerInfo.phone}
            onChange={(e) =>
              setBuyerInfo({ ...buyerInfo, phone: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Item Rows */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500">
            No items available. Please add at least one row.
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded shadow-sm bg-white"
            >
              <div className="flex flex-wrap gap-2">
                {["PROFILE", "PACKS", "LENGTHS", "QTY", "WEIGHT"].map(
                  (field) => (
                    <input
                      key={field}
                      name={field}
                      placeholder={field}
                      value={item[field]}
                      onChange={(e) => handleChange(index, e)}
                      className="border px-3 py-2 rounded w-32"
                    />
                  )
                )}
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
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={addRow}
          className="bg-[#1E1E2D] text-white px-4 py-2 rounded hover:bg-[#2b2b53]"
        >
          + Add Row
        </button>
        <button
          onClick={confirmBuy}
          className="bg-[#fabd05] text-[#1E1E2D] px-4 py-2 rounded hover:bg-yellow-400"
        >
          Buy All
        </button>
      </div>

      {/* Total Amount */}
      {totalAmount > 0 && (
        <p className="mt-4 font-semibold text-green-700">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </p>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#1E1E2D]">
              Confirm Purchase
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to proceed with buying?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#1E1E2D] text-white rounded"
              >
                {isLoading ? (
                  <div className="loader border-4 border-gray-300 border-t-[#fabd05] rounded-full w-6 h-6 animate-spin"></div>
                ) : (
                  "Yes, Buy"
                )}
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default BuyPage;

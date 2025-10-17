import { useState } from "react";
import { PlusCircle, UserRoundCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

const BuyPage = () => {
  const [items, setItems] = useState([
    { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "" },
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
    const { name, value } = e.target;
    const updated = [...items];
    updated[index][name] = value;

    if (["PACKS", "LENGTHS", "QTY"].includes(name) && value !== "") {
      ["PACKS", "LENGTHS", "QTY"].forEach((key) => {
        if (key !== name) updated[index][key] = "";
      });
    }

    setItems(updated);
  };

  const addRow = () =>
    setItems([...items, { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "" }]);

  const removeRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const isNumeric = (val) => /^(\d+(\.\d{1,2})?)?$/.test(val);

  const validateBuyerInfo = () => {
    const requiredFields = {
      companyName: "Vendor Company Name",
    };

    let isValid = true;

    for (const key in requiredFields) {
      if (!buyerInfo[key]?.trim()) {
        toast.error(`${requiredFields[key]} is required`);
        isValid = false;
      }
    }

    return isValid;
  };

  const confirmBuy = () => {
    for (let i = 0; i < items.length; i++) {
      const { PROFILE, PACKS, LENGTHS, QTY } = items[i];
      const filledFields = [PACKS, LENGTHS, QTY].filter(Boolean);

      if (!PROFILE.trim()) {
        toast.error(`PROFILE is required`);
        return;
      }

      if (filledFields.length === 0) {
        toast.error(`Enter either PACKS, LENGTHS, or QTY`);
        return;
      }

      const value = filledFields[0];
      if (!isNumeric(value)) {
        toast.error(`Only numbers allowed in PACKS/LENGTHS/QTY`);
        return;
      }
    }

    if (!validateBuyerInfo()) return;

    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await API.post(`/buy`, { items, buyerInfo });
      toast.success("Buy successful");
      setTotalAmount(res.data.totalAmount || 0);
      setItems([{ PROFILE: "", PACKS: "", LENGTHS: "", QTY: "" }]);
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

      <div className="bg-yellow-100 text-[#1E1E2D] border-l-4 border-[#fabd05] p-4 rounded mb-6 text-sm">
        <p>📌 Please ensure:</p>
        <ul className="list-disc pl-6">
          <li>
            The <strong>PROFILE</strong> must exactly match one from your
            inventory.
          </li>
          <li>
            You can enter only <strong>one of PACKS, LENGTHS, or QTY</strong>{" "}
            per item.
          </li>
          <li>
            Entered value must be a number. Clearing the value will re-enable
            all fields.
          </li>
        </ul>
      </div>

      {/* Buyer Info */}
      <div className="mb-6 bg-white border-l-4 border-[#fabd05] rounded-lg p-4 shadow-sm">
        <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
          <UserRoundCheck className="text-[#fabd05]" size={18} />
          Vendor / Customer Details
        </h3>
        <div className="space-y-3">
          {["companyName", "address", "gstin", "phone"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={buyerInfo[field]}
              onChange={(e) =>
                setBuyerInfo({ ...buyerInfo, [field]: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          ))}
        </div>
      </div>

      {/* Item Rows */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const filledField = ["PACKS", "LENGTHS", "QTY"].find(
            (key) => item[key] !== ""
          );

          return (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded shadow-sm bg-white"
            >
              <div className="flex flex-wrap gap-2">
                <input
                  name="PROFILE"
                  placeholder="PROFILE"
                  value={item.PROFILE}
                  onChange={(e) => handleChange(index, e)}
                  className="border px-3 py-2 rounded w-32"
                />
                {["PACKS", "LENGTHS", "QTY"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field}
                    value={item[field]}
                    onChange={(e) => handleChange(index, e)}
                    className="border px-3 py-2 rounded w-32"
                    disabled={filledField && filledField !== field}
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
          );
        })}
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

import { useState, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import { MinusCircle, UserRoundCheck } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

const SellPage = () => {
  const [items, setItems] = useState([
    { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "", errors: {} },
  ]);
  const [profiles, setProfiles] = useState([]);
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

  // Fetch profiles from inventory
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await API.get("/inventory"); // adjust endpoint as needed
        const uniqueProfiles = [
          ...new Set(res.data.map((item) => item.PROFILE)),
        ];
        setProfiles(uniqueProfiles);
      } catch (err) {
        console.error("Error fetching profiles:", err);
      }
    };
    fetchProfiles();
  }, []);

  const addRow = () =>
    setItems([
      ...items,
      { PROFILE: "", PACKS: "", LENGTHS: "", QTY: "", errors: {} },
    ]);

  const removeRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...items];
    updated[index][name] = value;
    updated[index].errors[name] = false;

    if (["PACKS", "LENGTHS", "QTY"].includes(name) && value !== "") {
      ["PACKS", "LENGTHS", "QTY"].forEach((field) => {
        if (field !== name) updated[index][field] = "";
      });
    }

    setItems(updated);
  };

  const isFieldDisabled = (item, currentField) => {
    const filled = ["PACKS", "LENGTHS", "QTY"].find(
      (field) => item[field] !== "" && field !== currentField
    );
    return filled !== undefined;
  };

  const validateBuyerInfo = () => {
    const requiredFields = { companyName: "Buyer Name" };
    let isValid = true;

    for (const key in requiredFields) {
      if (!buyerInfo[key]?.trim()) {
        toast.error(`${requiredFields[key]} is required`);
        isValid = false;
      }
    }

    return isValid;
  };

  const validateItems = () => {
    const updated = [...items];
    let isValid = true;

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      const errors = {};

      if (!item.PROFILE.trim()) {
        errors.PROFILE = true;
        toast.error(`PROFILE is required`);
        isValid = false;
        break;
      }

      if (!item.PACKS.trim() && !item.LENGTHS.trim() && !item.QTY.trim()) {
        errors.PACKS = errors.LENGTHS = errors.QTY = true;
        toast.error(`Enter either PACKS, LENGTHS, or QTY`);
        isValid = false;
        break;
      }

      ["PACKS", "LENGTHS", "QTY"].forEach((field) => {
        if (item[field].trim() !== "" && isNaN(Number(item[field]))) {
          errors[field] = true;
          toast.error(`${field} must be a number`);
          isValid = false;
        }
      });

      updated[i].errors = errors;
    }

    setItems(updated);
    return isValid;
  };

  const confirmSell = () => {
    const isItemsValid = validateItems();
    const isBuyerValid = validateBuyerInfo();

    if (isItemsValid && isBuyerValid) {
      setShowConfirm(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = items.map(({ errors, ...rest }) => rest);
      const res = await API.post(`/sell`, {
        items: payload,
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

  // ===== AUTOSUGGEST HANDLERS =====
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : profiles.filter((profile) =>
          profile.toLowerCase().includes(inputValue)
        );
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => (
    <div className="p-2 hover:bg-yellow-100 cursor-pointer">{suggestion}</div>
  );

  return (
    <div className="p-6 text-[#1E1E2D]">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MinusCircle className="text-[#fabd05]" /> Sell Materials (Multiple)
      </h2>

      <div className="bg-yellow-100 text-[#1E1E2D] border-l-4 border-[#fabd05] p-4 rounded mb-6 text-sm">
        <p>📌 Please ensure:</p>
        <ul className="list-disc pl-6">
          <li>
            The <strong>PROFILE</strong> must match one from your inventory.
          </li>
          <li>
            Only one of <strong>PACKS, LENGTHS, or QTY</strong> can be entered.
          </li>
          <li>Entered value must be numeric.</li>
        </ul>
      </div>

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

      {/* Items Section */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded shadow-sm bg-white"
          >
            <div className="flex flex-wrap gap-2 items-center">
              {/* Profile with Autosuggest */}
              <div className="relative">
                <Autosuggest
                  suggestions={getSuggestions(item.PROFILE)}
                  onSuggestionsFetchRequested={({ value }) => {
                    const updated = [...items];
                    updated[index].suggestions = getSuggestions(value);
                    setItems(updated);
                  }}
                  onSuggestionsClearRequested={() => {
                    const updated = [...items];
                    updated[index].suggestions = [];
                    setItems(updated);
                  }}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={{
                    placeholder: "PROFILE",
                    value: item.PROFILE,
                    onChange: (_, { newValue }) => {
                      const updated = [...items];
                      updated[index].PROFILE = newValue;
                      updated[index].errors.PROFILE = false;
                      setItems(updated);
                    },
                    className: `border px-3 py-2 rounded w-40 ${
                      item.errors?.PROFILE ? "border-red-500" : ""
                    }`,
                  }}
                  theme={{
                    container: "relative w-40",
                    suggestionsContainer:
                      "absolute z-10 bg-white border border-gray-200 rounded mt-1 w-full",
                    suggestionsList: "list-none p-0 m-0",
                    suggestionHighlighted: "bg-yellow-100",
                  }}
                />
              </div>

              {/* Other inputs */}
              {["PACKS", "LENGTHS", "QTY"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field}
                  value={item[field]}
                  onChange={(e) => handleChange(index, e)}
                  className={`border px-3 py-2 rounded w-32 ${
                    item.errors?.[field] ? "border-red-500" : ""
                  }`}
                  disabled={isFieldDisabled(item, field)}
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

      {totalAmount > 0 && (
        <p className="font-semibold text-green-700 mt-4">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </p>
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

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import TableView from "../components/TableView";
import { FileUp, Trash2, Box } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "./Api";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await API.get(`/inventory`);
        setInventory(res.data);
        setImported(res.data.length > 0);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        toast.error("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(sheet);

      try {
        await API.post(`/inventory/upload`, parsedData);
        setInventory(parsedData);
        setImported(true);
        toast.success("Inventory imported successfully");
      } catch (err) {
        console.error("Upload failed:", err);
        toast.error("Failed to upload inventory");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDelete = () => setShowConfirm(true);

  const handleDeleteConfirmed = async () => {
    try {
      await API.delete(`/inventory/delete`);
      setInventory([]);
      setImported(false);
      setShowConfirm(false);
      toast.success("Inventory deleted successfully");
    } catch (err) {
      console.error("Failed to delete inventory:", err);
      toast.error("Failed to delete inventory");
    }
  };

  return (
    <div className="p-6 text-[#1E1E2D]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Box className="text-[#fabd05]" /> Inventory Management
        </h2>
        {!imported ? (
          <>
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <FileUp className="w-5 h-5" /> Import Excel
            </button>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        ) : (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <Trash2 className="w-5 h-5" /> Delete Inventory
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-[#1E1E2D] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-4 text-[#1E1E2D] font-medium">
              Loading inventory...
            </span>
          </div>
        ) : inventory.length > 0 ? (
          <TableView data={inventory} />
        ) : (
          <p className="text-gray-500 text-sm">
            No inventory data uploaded yet.
          </p>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-red-700">
              Confirm Deletion
            </h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete all inventory data?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleDeleteConfirmed}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;

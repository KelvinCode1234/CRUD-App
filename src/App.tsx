import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface Item {
  id: number;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>(() => {
    const savedItems = localStorage.getItem("crudItems");
    return savedItems ? JSON.parse(savedItems) : [{ id: 1, name: "Sample Item" }];
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastColor, setToastColor] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("crudItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-white" : "bg-light text-dark";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const showToast = (message: string, color: string) => {
    setToastMessage(message);
    setToastColor(color);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const addItem = (): void => {
    if (!editName.trim()) {
      showToast("Name cannot be empty!", "danger");
      return;
    }
    const newItem: Item = { id: items.length + 1, name: editName.trim() };
    setItems([...items, newItem]);
    setEditName("");
    showToast("Item added successfully!", "success");
  };

  const deleteItem = (id: number): void => {
    setItems(items.filter((item) => item.id !== id));
    showToast("Item deleted!", "danger");
  };

  const startEditing = (item: Item): void => {
    setEditId(item.id);
    setEditName(item.name);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const saveEdit = (): void => {
    if (!editName.trim()) {
      showToast("Name cannot be empty!", "danger");
      return;
    }
    setItems(items.map((item) => (item.id === editId ? { ...item, name: editName } : item)));
    setEditId(null);
    setEditName("");
    showToast("Item updated successfully!", "warning");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5 border-success p-3">
        My <span className="text-danger">C</span>
        <span className="text-primary">R</span>
        <span className="text-success">U</span>
        <span className="text-warning">D</span> App
      </h1>

      <button className="btn btn-primary mt-3" onClick={addItem}>
        Add New Item
      </button>

      <button className="btn btn-secondary ms-3 mt-3" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <table className="table table-bordered mt-4">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {editId === item.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editId === item.id ? (
                  <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
                    Save
                  </button>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEditing(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
          <div className={`toast show bg-${toastColor} text-white fade`} role="alert">
            <div className="toast-body d-flex align-items-center">
              {toastColor === "success" && <span className="me-2">✅</span>}
              {toastColor === "warning" && <span className="me-2">⚠️</span>}
              {toastColor === "danger" && <span className="me-2">❌</span>}
              {toastMessage}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

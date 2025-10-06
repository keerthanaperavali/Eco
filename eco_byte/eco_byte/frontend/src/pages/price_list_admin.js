import React, { useEffect, useState } from "react";
import "../styles/tables.css";

export default function PriceListAdmin() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/price-list-admin");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      return { key, direction: "asc" };
    });
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Filtered & sorted
  const filteredItems = items.filter((item) => item.item_name.toLowerCase().includes(search.toLowerCase()));
  const sortedItems = sortData(filteredItems);

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / pageSize);
  const paginatedItems = sortedItems.slice((page - 1) * pageSize, page * pageSize);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Add/Edit Item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !minPrice || !maxPrice) return alert("Please fill all fields");

    const formData = new FormData();
    formData.append("item_name", itemName);
    formData.append("min_price", minPrice);
    formData.append("max_price", maxPrice);
    if (imageFile) formData.append("image", imageFile);

    try {
      const url = editingItem
        ? `http://localhost:5000/api/price-list-admin/${editingItem.id}`
        : "http://localhost:5000/api/price-list-admin";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save item");

      setShowModal(false);
      setEditingItem(null);
      setItemName("");
      setMinPrice("");
      setMaxPrice("");
      setImageFile(null);
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setItemName(item.item_name);
    setMinPrice(item.min_price);
    setMaxPrice(item.max_price);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/price-list-admin/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="user-table-container">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Manage Price List</h1>

      {/* Add + Button */}
      <button className="add-btn" onClick={() => setShowModal(true)} aria-label="Add New Item">
        Add <span className="add-plus">+</span>
      </button>

      {/* Search & Page Size */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="table-search"
        />
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="page-size">
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>{size} rows</option>
          ))}
        </select>
      </div>
          <div className="user-table-wrapper">

      {/* Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID {renderSortArrow("id")}</th>
            <th onClick={() => handleSort("item_name")}>Item Name {renderSortArrow("item_name")}</th>
            <th onClick={() => handleSort("min_price")}>Min Price {renderSortArrow("min_price")}</th>
            <th onClick={() => handleSort("max_price")}>Max Price {renderSortArrow("max_price")}</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item_name}</td>
                <td>{item.min_price}</td>
                <td>{item.max_price}</td>
                <td>{item.image_url && <img src={item.image_url} alt={item.item_name} style={{ width: "50px", borderRadius: "4px" }} />}</td>
                <td>
                  <button
  className="btn-icon btn-green"
  onClick={() => handleEdit(item)}
  title="Edit"
  aria-label="Edit Item"
>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
  </svg>
</button>

<button
  className="btn-icon btn-deactivate"
  onClick={() => handleDelete(item.id)}
  title="Delete"
  aria-label="Delete Item"
>
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
  </svg>
</button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-gray-500 text-center p-4">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Pagination */}
      <div className="table-footer">
        <button onClick={() => changePage(page - 1)} disabled={page === 1}>Prev</button>
        <span>Page {page} of {totalPages || 1}</span>
        <button onClick={() => changePage(page + 1)} disabled={page === totalPages || totalPages === 0}>Next</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <form className="modal-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required className="table-search" />
              <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} required className="table-search" />
              <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} required className="table-search" />
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
              <div className="modal-actions">
                <button type="submit" className="btn-green">{editingItem ? "Update" : "Add"}</button>
                <button type="button" className="btn-gray" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

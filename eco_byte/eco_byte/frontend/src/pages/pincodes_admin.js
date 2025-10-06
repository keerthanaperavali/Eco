import React, { useEffect, useState } from "react";
import "../styles/tables.css"; // Your CSS

export default function AdminPincodes() {
  const [pincode, setPincode] = useState("");
  const [pincodes, setPincodes] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch pincodes
  const fetchPincodes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pincodes");
      const data = await response.json();
      setPincodes(data);
    } catch (error) {
      console.error("Error fetching pincodes:", error);
    }
  };

  useEffect(() => {
    fetchPincodes();
  }, []);

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
    setPage(1);
  };

  // Arrow render function
  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  // Sorting function
  const sortData = (data, key, order) => {
    if (!key) return data;
    return [...data].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Add new pincode submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pincode) return alert("Enter a valid pincode");

    try {
      const response = await fetch("http://localhost:5000/api/pincodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      if (!response.ok) throw new Error("Failed to add pincode");
      setPincode("");
      setShowModal(false);
      fetchPincodes();
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggle Active / Inactive
  const toggleActive = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/pincodes/${id}/toggle`, {
        method: "PUT",
      });
      fetchPincodes();
    } catch {
      alert("Error updating pincode status");
    }
  };

  // Filter by status
  const filterByStatus = (pin) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return pin.is_active;
    if (statusFilter === "deactive") return !pin.is_active;
    return true;
  };

  // Filtered and sorted pincodes
  const filteredPincodes = pincodes
    .filter((pin) => pin.pincode.toLowerCase().includes(search.toLowerCase()))
    .filter(filterByStatus);

  const sortedPincodes = sortData(
    filteredPincodes,
    sortConfig.key,
    sortConfig.direction
  );

  // Pagination variables
  const pageSize = 25;
  const totalPages = Math.ceil(sortedPincodes.length / pageSize);
  const paginatedPincodes = sortedPincodes.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Change page safely
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="user-table-container">
      <h1 className="text-2xl font-bold mb-6 text-green-800">
        Manage Service Pincodes
      </h1>

      {/* Add + Button */}
      <button
        className="add-btn"
        onClick={() => setShowModal(true)}
        aria-label="Add New Pincode"
      >
        Add <span className="add-plus">+</span>
      </button>

      {/* Status filters */}
      <div className="status-filters">
        <button
          className={statusFilter === "all" ? "btn-green" : "btn-gray"}
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
        >
          All
        </button>
        <button
          className={statusFilter === "active" ? "btn-green" : "btn-gray"}
          onClick={() => {
            setStatusFilter("active");
            setPage(1);
          }}
        >
          Active
        </button>
        <button
          className={statusFilter === "deactive" ? "btn-green" : "btn-gray"}
          onClick={() => {
            setStatusFilter("deactive");
            setPage(1);
          }}
        >
          Inactive
        </button>
      </div>

      {/* Search box */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search pincodes..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="table-search"
        />
      </div>

      {/* Pincode Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("id")}
              className="sortable"
              style={{ userSelect: "none" }}
            >
              ID {renderSortArrow("id")}
            </th>
            <th
              onClick={() => handleSort("pincode")}
              className="sortable"
              style={{ userSelect: "none" }}
            >
              Pincode {renderSortArrow("pincode")}
            </th>
            <th
              onClick={() => handleSort("is_active")}
              className="sortable"
              style={{ userSelect: "none" }}
            >
              Status {renderSortArrow("is_active")}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPincodes.length > 0 ? (
            paginatedPincodes.map((pin) => (
              <tr key={pin.id}>
                <td>{pin.id}</td>
                <td>{pin.pincode}</td>
                <td>
                  {pin.is_active ? (
                    <span className="status-badge active">Active</span>
                  ) : (
                    <span className="status-badge inactive">Inactive</span>
                  )}
                </td>
                <td>
                 <td>
  <button
    className={pin.is_active ? "btn-deactivate" : "btn-activate"}
    onClick={() => toggleActive(pin.id)}
  >
    {pin.is_active ? "Deactivate" : "Activate"}
  </button>
</td>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-gray-500 text-center p-4">
                No pincodes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="table-footer">
        <button onClick={() => changePage(page - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {/* Add Pincode Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content">
            <h2 id="modal-title" className="modal-title">
              Add New Pincode
            </h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, ""))
                }
                required
                className="table-search"
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="btn-green">
                  Add
                </button>
                <button
                  type="button"
                  className="btn-gray"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

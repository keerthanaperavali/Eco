import React, { useEffect, useState } from "react";
import "../styles/tables.css";

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination, search and filter
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, incomplete

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    fetch("http://localhost:5000/api/quotations")
      .then((res) => res.json())
      .then((data) => {
        // Initialize all with status 'incomplete' if no status property exists
        const initializedData = data.map((q) => ({
          ...q,
          status: q.status || "incomplete",
        }));
        setQuotations(initializedData);
        setFiltered(initializedData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load quotations");
        setLoading(false);
      });
  }, []);

  // Filter & search combined
  useEffect(() => {
    let results = quotations;
    if (statusFilter !== "all") {
      results = results.filter((q) => q.status === statusFilter);
    }
    if (searchTerm) {
      results = results.filter(
        (q) =>
          q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (q.quotation_id &&
            q.quotation_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFiltered(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, quotations]);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filtered, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Sort handler
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
    setCurrentPage(1);
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  // Handle marking as completed
  const markComplete = async (quotationId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quotations/${quotationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );
      if (!response.ok) throw new Error("Failed to update status");
      setQuotations((prev) =>
        prev.map((q) =>
          q.quotation_id === quotationId ? { ...q, status: "completed" } : q
        )
      );
    } catch (err) {
      alert(err.message || "Error updating status");
    }
  };

  if (loading)
    return <div className="table-loading">Loading quotations...</div>;
  if (error) return <div className="table-error">{error}</div>;

  return (
    <div className="user-table-container">
      <h2
        style={{ fontWeight: 700, color: "#2f865b", marginBottom: "1.1rem" }}
      >
        Quotation Requests
      </h2>

      {/* Status tab filters */}
     <div className="status-filters">
  {["all", "completed", "incomplete"].map((status) => (
    <button
      key={status}
      type="button"
      onClick={() => setStatusFilter(status)}
      className={`status-btn${statusFilter === status ? " active" : ""}`}
    >
      {status === "all"
        ? "All"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  ))}
</div>

      {/* Controls: search left, page-size right */}
      <div
        className="table-controls"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <input
          type="text"
          placeholder="Search by Name, Phone, or ID..."
          className="table-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        <select
          className="page-size"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={10}>10 rows</option>
          <option value={25}>25 rows</option>
          <option value={50}>50 rows</option>
          <option value={100}>100 rows</option>
        </select>
      </div>
<div className="user-table-wrapper">

      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("quotation_id")}>
              Quotation ID {renderSortArrow("quotation_id")}
            </th>
            <th onClick={() => handleSort("name")}>
              Name {renderSortArrow("name")}
            </th>
            <th onClick={() => handleSort("phone")}>
              Phone {renderSortArrow("phone")}
            </th>
            <th onClick={() => handleSort("address")}>
              Address {renderSortArrow("address")}
            </th>
            <th>Message</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((q) => (
              <tr key={q.id ?? q.quotation_id}>
                <td>{q.quotation_id}</td>
                <td>{q.name}</td>
                <td>{q.phone}</td>
                <td>{q.address}</td>
                <td>{q.message}</td>
                <td>
                  {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                </td>
                <td>
                  {q.status === "incomplete" ? (
                    <button
                      className="mark-complete-btn"
                      onClick={() => markComplete(q.quotation_id)}
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "#e6f4ea",
                        color: "#2e7d32",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No quotations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <div className="table-footer">
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

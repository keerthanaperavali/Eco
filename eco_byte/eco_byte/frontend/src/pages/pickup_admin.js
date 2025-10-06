import React, { useState, useEffect } from "react";
import "../styles/tables.css";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, complete, incomplete, cancelled
  const [sortConfig, setSortConfig] = useState({ key: "pickup_id", direction: "asc" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [loadingStatusIds, setLoadingStatusIds] = useState(new Set());

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err.message);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update status to complete
  const updateStatusToComplete = async (pickupId) => {
    setLoadingStatusIds((prev) => new Set(prev).add(pickupId));
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${pickupId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "complete" }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchBookings(); // Refresh list
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingStatusIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(pickupId);
        return newSet;
      });
    }
  };

  // (Optional) You can implement a cancel function similarly that calls PATCH with status 'cancelled'.

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
    setPage(1);
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const sortedBookings = React.useMemo(() => {
    if (!bookings) return [];
    const sorted = [...bookings].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [bookings, sortConfig]);

  const filteredBookings = sortedBookings.filter((b) => {
    const matchesSearch =
      b.address?.toLowerCase().includes(search.toLowerCase()) ||
      b.scrap_type?.toLowerCase().includes(search.toLowerCase());

    const status = (b.status || "incomplete").toLowerCase();
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "complete" && (status === "complete" || status === "completed")) ||
      (statusFilter === "incomplete" && status === "incomplete") ||
      (statusFilter === "cancelled" && status === "cancelled");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="user-table-container">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Manage Pickup Bookings</h1>

      {/* Status Filter Buttons */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className={statusFilter === "all" ? "btn-green" : "btn-gray"}
          style={{ marginRight: 8 }}
        >
          All
        </button>
        <button
          onClick={() => {
            setStatusFilter("complete");
            setPage(1);
          }}
          className={statusFilter === "complete" ? "btn-green" : "btn-gray"}
          style={{ marginRight: 8 }}
        >
          Complete
        </button>
        <button
          onClick={() => {
            setStatusFilter("incomplete");
            setPage(1);
          }}
          className={statusFilter === "incomplete" ? "btn-green" : "btn-gray"}
          style={{ marginRight: 8 }}
        >
          Incomplete
        </button>
        <button
          onClick={() => {
            setStatusFilter("cancelled");
            setPage(1);
          }}
          className={statusFilter === "cancelled" ? "btn-green" : "btn-gray"}
        >
          Cancelled
        </button>
      </div>

      {/* Search and Rows Per Page */}
      <div
        className="table-controls"
        style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}
      >
       <input
  type="text"
  placeholder="Search by address or scrap type"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  className="table-search"
/>


        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
          className="page-size"
          style={{ width: 110 }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              Show {n}
            </option>
          ))}
        </select>
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("pickup_id")} className="sortable" style={{ userSelect: "none" }}>
                Booking ID {renderSortArrow("pickup_id")}
              </th>
              <th>User ID</th>
              <th>User Name</th>
              <th>User Phone</th>
              <th onClick={() => handleSort("area_type")} className="sortable" style={{ userSelect: "none" }}>
                Area Type {renderSortArrow("area_type")}
              </th>
              <th onClick={() => handleSort("order_type")} className="sortable" style={{ userSelect: "none" }}>
                Order Type {renderSortArrow("order_type")}
              </th>
              <th onClick={() => handleSort("address")} className="sortable" style={{ userSelect: "none" }}>
                Address {renderSortArrow("address")}
              </th>
              <th>Alternate Number</th>
              <th>Scrap Type</th>
              <th onClick={() => handleSort("pickup_date")} className="sortable" style={{ userSelect: "none" }}>
                Pickup Date {renderSortArrow("pickup_date")}
              </th>
              <th onClick={() => handleSort("created_at")} className="sortable" style={{ userSelect: "none" }}>
                Created At {renderSortArrow("created_at")}
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((booking) => {
                const status = (booking.status || "incomplete").toLowerCase();
                const isComplete = status === "complete" || status === "completed";
                const isCancelled = status === "cancelled";
                const loading = loadingStatusIds.has(booking.pickup_id);

                return (
                  <tr key={booking.pickup_id}>
                    <td>{booking.pickup_id}</td>
                    <td>{booking.user_id || "-"}</td>
                    <td>{booking.user_name || "-"}</td>
                    <td>{booking.user_phone || "-"}</td>
                    <td>{booking.area_type}</td>
                    <td>{booking.order_type}</td>
                    <td>{booking.address}</td>
                    <td>{booking.alternate_number || "-"}</td>
                    <td>{booking.scrap_type}</td>
                    <td>
                      {new Date(booking.pickup_date).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {new Date(booking.created_at).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {isComplete ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>Completed</span>
                      ) : isCancelled ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>Cancelled</span>
                      ) : (
                        <span>Incomplete</span>
                      )}
                    </td>
                    <td>
                      {isComplete ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>Completed</span>
                      ) : isCancelled ? (
                        <span style={{ color: "gray", fontWeight: "bold" }}>Cancelled</span>
                      ) : (
                        <button
                          className="btn-green"
                          onClick={() => !loading && updateStatusToComplete(booking.pickup_id)}
                          disabled={loading}
                          style={{ cursor: loading ? "not-allowed" : "pointer" }}
                        >
                          {loading ? "Updating..." : "Mark Complete"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="14" className="text-gray-500 text-center p-4">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer" style={{ marginTop: "1rem" }}>
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
    </div>
  );
}

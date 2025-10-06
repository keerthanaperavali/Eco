import React, { useState, useEffect } from "react";
import { Calendar, XCircle, CheckCircle } from "lucide-react";
import "../styles/managerequest.css";

const REQUEST_STATUSES = [
  { key: "upcoming", label: "Upcoming Requests", icon: <Calendar size={22} /> },
  { key: "cancelled", label: "Cancelled Requests", icon: <XCircle size={22} /> },
  { key: "complete", label: "Complete Requests", icon: <CheckCircle size={22} /> },
];

export default function ManageRequests() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [requests, setRequests] = useState([]);
  const [popupRequest, setPopupRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch only this user's requests by status
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust fetch as per token usage if needed
        const response = await fetch(`http://localhost:5000/api/requests?status=${activeTab}`);
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();

        // Use schema field names from your database, include cancelled_at
        const mappedData = data.map((r) => ({
          id: r.pickup_id ?? r.id, // Use pickup_id as the unique id
          scrapType: r.scrap_type || "N/A",
          pickupDate: r.pickup_date || new Date().toISOString(),
          cancelledAt: r.cancelled_at || null,
          status: r.status,
        }));

        setRequests(mappedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeTab]);

  // Format date for display
  function formatDateToMonthDayYear(dateStr) {
    if (!dateStr) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  }

  // Open/close cancel confirmation popup
  const openCancelPopup = (request) => setPopupRequest(request);
  const closePopup = () => setPopupRequest(null);

  // Handle cancel action
  const confirmCancel = async () => {
    try {
      // Include auth header if backend requires it
      const res = await fetch(`http://localhost:5000/api/requests/${popupRequest.id}/cancel`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to cancel request");

      setRequests((prev) =>
        prev.map((r) => (r.id === popupRequest.id ? { ...r, status: "cancelled" } : r))
      );
      if (activeTab !== "cancelled") {
        setRequests((prev) => prev.filter((r) => r.id !== popupRequest.id));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setPopupRequest(null);
    }
  };

  return (
    <div className="manage-requests-layout">
      {/* Sidebar with status tabs */}
      <aside className="request-sidebar">
        {REQUEST_STATUSES.map((tab) => (
          <button
            key={tab.key}
            className={`sidebar-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </aside>

      {/* Requests Table */}
      <div className="requests-table-wrapper">
        {loading ? (
          <div>Loading requests...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Scrap Type</th>
                <th>{activeTab === "cancelled" ? "Cancelled Date" : "Pickup Date"}</th>
                <th>Status</th>
                {activeTab === "upcoming" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={activeTab === "upcoming" ? 5 : 4}>No requests found.</td>
                </tr>
              ) : (
                requests.map((req, index) => (
                  <tr key={req.id}>
                    <td>{index + 1}</td>
                    <td>{req.scrapType}</td>
                    <td>
                      {activeTab === "cancelled"
                        ? formatDateToMonthDayYear(req.cancelledAt)
                        : formatDateToMonthDayYear(req.pickupDate)}
                    </td>
                    <td>{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</td>
                    {activeTab === "upcoming" && (
                      <td>
                        <button className="cancel-btn" onClick={() => openCancelPopup(req)}>
                          Cancel
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {popupRequest && (
        <div className="modal-overlay" onClick={closePopup}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: "16px", color: "#256627" }}>Cancel Request</h3>
            <div className="modal-body">
              <p>
                <strong>Scrap Type:</strong> {popupRequest.scrapType}
              </p>
              <p>
                <strong>Pickup Date:</strong> {formatDateToMonthDayYear(popupRequest.pickupDate)}
              </p>
              <p style={{ margin: "18px 0", fontWeight: "700" }}>
                Are you sure you want to cancel this request?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={confirmCancel}>
                Yes, Cancel
              </button>
              <button className="btn btn-secondary" onClick={closePopup}>
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

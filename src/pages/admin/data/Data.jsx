import React, { useEffect, useState } from "react";
import "./data.scss";

/* ===== PRODUCTION BACKEND ===== */
const API = "https://qonoqcapsule-backend.onrender.com/api/bookings";

/* ===== BRANCHES (BACKEND GA MOS) ===== */
const branches = [
  { id: "airport", name: "Tashkent Airport" },
  { id: "city", name: "Samarkand Airport" },
  { id: "north", name: "Samarkand Railway" },
];

/* ===== CAPSULE LABELS ===== */
const capsuleLabels = {
  family: "Family Capsule",
  standard: "Standard Capsule",
  standard_luxe: "Standard Luxe Capsule",
  family_luxe: "Family Luxe Capsule",
};

const Data = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    branch: "airport",
    capsuleType: "family",
    date: "",
    time: "",
    duration: 4,
  });

  /* ===== LOAD BOOKINGS ===== */

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      alert("Backend error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ===== ADD BOOKING ===== */

  const addBooking = async () => {
    if (!form.date || !form.time) {
      alert("Date & time required");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch: form.branch,
          capsuleType: form.capsuleType,
          date: form.date,
          time: form.time,
          duration: Number(form.duration),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Insert failed");
        return;
      }

      setForm({ ...form, date: "", time: "" });
      loadBookings();
    } catch (err) {
      alert("Network error. Backend unreachable.");
    }
  };

  /* ===== DELETE BOOKING ===== */

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      loadBookings();
    } catch (err) {
      alert("Network error");
    }
  };

  return (
    <div className="admin">
      <h1 className="admin__title">Admin — Capsule Bookings</h1>

      <div className="container">
        {/* ================= FORM ================= */}
        <div className="admin__form">
          <div className="admin__row">
            <label>Branch</label>
            <select
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin__row">
            <label>Capsule Type</label>
            <select
              value={form.capsuleType}
              onChange={(e) =>
                setForm({ ...form, capsuleType: e.target.value })
              }
            >
              <option value="family">Family Capsule</option>
              <option value="standard">Standard Capsule</option>
              <option value="standard_luxe">Standard Luxe Capsule</option>
              <option value="family_luxe">Family Luxe Capsule</option>
            </select>
          </div>

          <div className="admin__grid">
            <div className="admin__row">
              <label>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="admin__row">
              <label>Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div className="admin__row">
            <label>Duration</label>
            <select
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: Number(e.target.value) })
              }
            >
              <option value={2}>Up to 2 hours</option>
              <option value={4}>Up to 4 hours</option>
              <option value={6}>Up to 6 hours</option>
              <option value={10}>Up to 10 hours</option>
              <option value={24}>Up to 24 hours</option>
            </select>
          </div>

          <button className="admin__add-btn" onClick={addBooking}>
            Add Booking
          </button>
        </div>

        {/* ================= LIST ================= */}
        <div className="admin__list">
          {loading && <p className="admin__loading">Loading...</p>}

          {!loading && bookings.length === 0 && (
            <p className="admin__empty">No bookings yet</p>
          )}

          {bookings.map((b) => (
            <div key={b.id} className="admin__card">
              <div>
                <span>Branch</span>
                <b>
                  {branches.find((x) => x.id === b.branch)?.name || b.branch}
                </b>
              </div>

              <div>
                <span>Capsule</span>
                <b>{capsuleLabels[b.capsuleType] || b.capsuleType}</b>
              </div>

              <div>
                <span>Date</span>
                <b>{b.date}</b>
              </div>

              <div>
                <span>Time</span>
                <b>{b.time}</b>
              </div>

              <div className="admin__duration">
                <span>Duration</span>
                <b>{b.duration}h</b>
              </div>

              <button
                className="admin__delete-btn"
                onClick={() => deleteBooking(b.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Data;

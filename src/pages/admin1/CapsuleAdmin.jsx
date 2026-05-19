import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createCapsuleAdminBooking,
  deleteCapsuleAdminBooking,
  getCapsuleAdminBookings,
} from "../../data/capsuleAdminApi";
import "./capsuleAdmin.scss";

const branches = [
  { label: "Barchasi", value: "all" },
  { label: "Tashkent Airport", value: "airport" },
  { label: "Samarkand Airport", value: "city" },
  { label: "Samarkand Railway", value: "north" },
];

const branchLabels = branches.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const capsuleTypes = [
  { label: "Standard", value: "standard" },
  { label: "Family", value: "family" },
  { label: "Standard Luxe", value: "standard_luxe" },
  { label: "Family Luxe", value: "family_luxe" },
];

const capsuleTypeLabels = capsuleTypes.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const durations = [
  { label: "2 soat", value: "2" },
  { label: "4 soat", value: "4" },
  { label: "6 soat", value: "6" },
  { label: "10 soat", value: "10" },
  { label: "1 kun", value: "24" },
];

const durationLabels = durations.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const paymentStatuses = [
  { label: "Qo'lda qo'shildi", value: "manual" },
  { label: "To'langan", value: "paid" },
  { label: "Kutilmoqda", value: "pending" },
];

const paymentStatusLabels = paymentStatuses.reduce((acc, item) => {
  acc[item.value] = item.label;
  return acc;
}, {});

const initialForm = {
  name: "",
  phone: "",
  email: "",
  branch: "airport",
  capsuleType: "standard",
  date: "",
  time: "",
  duration: "2",
  price: "",
  payment_status: "manual",
};

const showValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};

const formatPrice = (price) => {
  const numericPrice = Number(price || 0);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return "-";
  return `${numericPrice.toLocaleString("uz-UZ")} UZS`;
};

const formatDate = (value) => {
  if (!value) return "-";

  const dateOnly = String(value).slice(0, 10);
  const parsed = new Date(dateOnly);

  if (Number.isNaN(parsed.getTime())) return dateOnly || "-";

  return parsed.toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatTime = (value) => {
  if (!value) return "-";
  return String(value).slice(0, 5);
};

const formatDuration = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return durationLabels[String(value)] || `${value} soat`;
};

const formatCreatedAt = (value) => {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);

  return parsed.toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function CapsuleAdmin() {
  const [bookings, setBookings] = useState([]);
  const [branch, setBranch] = useState("all");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form, setForm] = useState(initialForm);

  const activeBranchLabel = useMemo(
    () => branchLabels[branch] || "Barchasi",
    [branch],
  );

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCapsuleAdminBookings(branch);
      const rows = Array.isArray(data) ? data : data?.bookings || [];

      setBookings(rows.filter((booking) => booking && booking.id));
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }, [branch]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const resetForm = () => {
    setForm(initialForm);
  };

  const closeCreateModal = () => {
    if (submitting) return;
    setShowCreateModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError("");

      await createCapsuleAdminBooking({
        ...form,
        duration: Number(form.duration),
        price: Number(form.price || 0),
      });

      setShowCreateModal(false);
      resetForm();
      await fetchBookings();
    } catch (err) {
      alert(err.message || "Bron qo'shishda xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!bookingId || deletingId) return;

    const confirmed = window.confirm("Bu bronni o'chirishni tasdiqlaysizmi?");
    if (!confirmed) return;

    try {
      setDeletingId(bookingId);
      setError("");

      await deleteCapsuleAdminBooking(bookingId);
      setSelectedBooking((current) =>
        current?.id === bookingId ? null : current,
      );
      await fetchBookings();
    } catch (err) {
      alert(err.message || "Bronni o'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
    }
  };

  const renderBookingDetails = (booking) => {
    const details = [
      ["Mijoz ismi", showValue(booking.name)],
      ["Telefon", showValue(booking.phone)],
      ["Email", showValue(booking.email)],
      ["Filial", branchLabels[booking.branch] || showValue(booking.branch)],
      [
        "Kapsula turi",
        capsuleTypeLabels[booking.capsuleType] ||
          showValue(booking.capsuleType),
      ],
      ["Kirish sanasi", formatDate(booking.date)],
      ["Kirish vaqti", formatTime(booking.time)],
      ["Davomiylik", formatDuration(booking.duration)],
      ["Narx", formatPrice(booking.price)],
      [
        "To'lov holati",
        paymentStatusLabels[booking.payment_status] ||
          showValue(booking.payment_status),
      ],
      ["Bron yaratilgan vaqt", formatCreatedAt(booking.createdAt)],
    ];

    return details.map(([label, value]) => (
      <div className="capsule-admin__detailItem" key={label}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    ));
  };

  return (
    <div className="capsule-admin">
      <div className="capsule-admin__top">
        <div className="capsule-admin__heading">
          <p className="capsule-admin__eyebrow">Qonoq Capsule</p>
          <h1>Admin Panel</h1>
          <span>Bronlar ro'yxati</span>
        </div>

        <div className="capsule-admin__actions">
          <label>
            <span>Filial</span>
            <select value={branch} onChange={(e) => setBranch(e.target.value)}>
              {branches.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button type="button" onClick={() => setShowCreateModal(true)}>
            + Yangi bron
          </button>
        </div>
      </div>

      <div className="capsule-admin__summary">
        <div>
          <span>Tanlangan filial</span>
          <strong>{activeBranchLabel}</strong>
        </div>
        <div>
          <span>Bronlar soni</span>
          <strong>{loading ? "-" : bookings.length}</strong>
        </div>
      </div>

      {error && <p className="capsule-admin__error">{error}</p>}

      <div className="capsule-admin__list">
        {loading ? (
          <p className="capsule-admin__empty">Yuklanmoqda...</p>
        ) : bookings.length === 0 ? (
          <p className="capsule-admin__empty">Bronlar topilmadi</p>
        ) : (
          bookings.map((booking, index) => (
            <article className="capsule-admin__card" key={booking.id}>
              <div className="capsule-admin__number">{index + 1}</div>

              <div className="capsule-admin__info">
                <div className="capsule-admin__cardHead">
                  <h3>{showValue(booking.name) === "-" ? "Mijoz ismi yo'q" : booking.name}</h3>
                  <span
                    className={`capsule-admin__status capsule-admin__status--${
                      booking.payment_status || "manual"
                    }`}
                  >
                    {paymentStatusLabels[booking.payment_status] ||
                      showValue(booking.payment_status)}
                  </span>
                </div>

                <div className="capsule-admin__grid">
                  <div>
                    <span>Telefon</span>
                    <strong>{showValue(booking.phone)}</strong>
                  </div>
                  <div>
                    <span>Email</span>
                    <strong>{showValue(booking.email)}</strong>
                  </div>
                  <div>
                    <span>Filial</span>
                    <strong>
                      {branchLabels[booking.branch] ||
                        showValue(booking.branch)}
                    </strong>
                  </div>
                  <div>
                    <span>Kirish sanasi</span>
                    <strong>{formatDate(booking.date)}</strong>
                  </div>
                  <div>
                    <span>Kirish vaqti</span>
                    <strong>{formatTime(booking.time)}</strong>
                  </div>
                  <div>
                    <span>Kapsula turi</span>
                    <strong>
                      {capsuleTypeLabels[booking.capsuleType] ||
                        showValue(booking.capsuleType)}
                    </strong>
                  </div>
                  <div>
                    <span>Davomiylik</span>
                    <strong>{formatDuration(booking.duration)}</strong>
                  </div>
                  <div>
                    <span>Bron yaratilgan vaqt</span>
                    <strong>{formatCreatedAt(booking.createdAt)}</strong>
                  </div>
                </div>
              </div>

              <div className="capsule-admin__side">
                <span>Narx</span>
                <strong>{formatPrice(booking.price)}</strong>
                <div className="capsule-admin__cardActions">
                  <button
                    type="button"
                    className="capsule-admin__secondary"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    Batafsil
                  </button>
                  <button
                    type="button"
                    className="capsule-admin__danger"
                    disabled={deletingId === booking.id}
                    onClick={() => handleDeleteBooking(booking.id)}
                  >
                    {deletingId === booking.id ? "O'chirilmoqda" : "O'chirish"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {showCreateModal && (
        <div className="capsule-admin__modalOverlay" onMouseDown={closeCreateModal}>
          <div
            className="capsule-admin__modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="capsule-admin__modalHead">
              <div>
                <p>Yangi bron</p>
                <h2>Bron ma'lumotlari</h2>
              </div>
              <button type="button" onClick={closeCreateModal}>
                x
              </button>
            </div>

            <form
              onSubmit={handleCreateBooking}
              className="capsule-admin__form"
            >
              <label>
                <span>Mijoz ismi</span>
                <input
                  name="name"
                  placeholder="Ism familiya"
                  value={form.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Telefon raqami</span>
                <input
                  name="phone"
                  placeholder="+998"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Filial</span>
                <select name="branch" value={form.branch} onChange={handleChange}>
                  {branches
                    .filter((item) => item.value !== "all")
                    .map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                <span>Kapsula turi</span>
                <select
                  name="capsuleType"
                  value={form.capsuleType}
                  onChange={handleChange}
                >
                  {capsuleTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Kirish sanasi</span>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Kirish vaqti</span>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Davomiylik</span>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                >
                  {durations.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Narx</span>
                <input
                  type="number"
                  min="0"
                  name="price"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>To'lov holati</span>
                <select
                  name="payment_status"
                  value={form.payment_status}
                  onChange={handleChange}
                >
                  {paymentStatuses.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <button type="submit" disabled={submitting}>
                {submitting ? "Saqlanmoqda..." : "Bronni saqlash"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div
          className="capsule-admin__modalOverlay"
          onMouseDown={() => setSelectedBooking(null)}
        >
          <div
            className="capsule-admin__modal capsule-admin__modal--details"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="capsule-admin__modalHead">
              <div>
                <p>Bron tafsilotlari</p>
                <h2>{showValue(selectedBooking.name)}</h2>
              </div>
              <button type="button" onClick={() => setSelectedBooking(null)}>
                x
              </button>
            </div>

            <div className="capsule-admin__details">
              {renderBookingDetails(selectedBooking)}
            </div>

            <div className="capsule-admin__modalActions">
              <button
                type="button"
                className="capsule-admin__secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Yopish
              </button>
              <button
                type="button"
                className="capsule-admin__danger"
                disabled={deletingId === selectedBooking.id}
                onClick={() => handleDeleteBooking(selectedBooking.id)}
              >
                {deletingId === selectedBooking.id ? "O'chirilmoqda" : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CapsuleAdmin;

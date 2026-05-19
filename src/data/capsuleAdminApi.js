const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const readErrorMessage = async (res, fallback) => {
  const data = await res.json().catch(() => null);
  return data?.error || data?.message || fallback;
};

export async function getCapsuleAdminBookings(branch = "all") {
  const url =
    branch && branch !== "all"
      ? `${API_URL}/api/capsule-admin/bookings?branch=${encodeURIComponent(
          branch,
        )}`
      : `${API_URL}/api/capsule-admin/bookings`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      await readErrorMessage(res, "Bronlarni olishda xatolik yuz berdi"),
    );
  }

  return res.json();
}

export async function createCapsuleAdminBooking(data) {
  const res = await fetch(`${API_URL}/api/capsule-admin/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error("Bu vaqt uchun kapsula band. Boshqa vaqt tanlang.");
    }

    if (res.status === 400) {
      throw new Error("Kerakli ma'lumotlarni to'liq kiriting.");
    }

    throw new Error(
      await readErrorMessage(res, "Bron qo'shishda xatolik yuz berdi"),
    );
  }

  return res.json();
}

export async function deleteCapsuleAdminBooking(id) {
  const res = await fetch(`${API_URL}/api/capsule-admin/bookings/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(
      await readErrorMessage(res, "Bronni o'chirishda xatolik yuz berdi"),
    );
  }

  return res.json();
}

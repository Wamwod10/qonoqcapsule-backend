import React, { useEffect, useMemo, useState } from "react";
import "./paymentsuccess.scss";
import { FaCheck } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const API = "https://qonoqcapsule-backend.onrender.com";
// const API = "http://localhost:5000";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = useMemo(() => searchParams.get("orderId") || "", [searchParams]);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("checking");
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const checkPaymentStatus = async () => {
      if (!orderId) {
        if (!cancelled) {
          setLoading(false);
          setStatus("invalid");
          setError("Order ID not found");
        }
        return;
      }

      try {
        const res = await fetch(`${API}/api/payment-status/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to check payment status");
        }

        if (cancelled) return;

        setPaymentData(data);

        const paymentStatus = String(data?.status || "").toLowerCase();

        if (
          [
            "success",
            "succeeded",
            "paid",
            "capture",
            "captured",
            "completed",
          ].includes(paymentStatus)
        ) {
          setStatus("success");
          localStorage.removeItem("my_bookings");
        } else if (
          [
            "failed",
            "cancelled",
            "canceled",
            "expired",
            "rejected",
            "prepare_failed",
            "paid_but_slot_unavailable",
          ].includes(paymentStatus)
        ) {
          setStatus("failed");
        } else {
          setStatus("pending");
        }
      } catch (err) {
        console.error("PAYMENT STATUS ERROR:", err);

        if (!cancelled) {
          setStatus("error");
          setError(err.message || "Unexpected error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    checkPaymentStatus();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="qonoq-success">
      <div className="qonoq-success__card">
        {loading ? (
          <>
            <h1>Checking Payment...</h1>
            <p>Please wait while we verify your payment status.</p>
          </>
        ) : status === "success" ? (
          <>
            <FaCheck className="qonoq-success__icon" />
            <h1>Payment Successful</h1>
            <p>Your booking has been confirmed successfully</p>

            <div className="qonoq-success__line" />

            <div className="qonoq-success__info">
              <div>
                <span>Status</span>
                <strong>Confirmed</strong>
              </div>

              <div>
                <span>Hotel</span>
                <strong>Qonoq Capsule</strong>
              </div>

              <div>
                <span>Order ID</span>
                <strong>{orderId}</strong>
              </div>

              {paymentData?.amount ? (
                <div>
                  <span>Amount</span>
                  <strong>{Number(paymentData.amount).toLocaleString()} UZS</strong>
                </div>
              ) : null}
            </div>
          </>
        ) : status === "pending" ? (
          <>
            <h1>Payment is still processing</h1>
            <p>
              Your payment has not been fully confirmed yet. Please wait a little
              and refresh this page.
            </p>

            <div className="qonoq-success__line" />

            <div className="qonoq-success__info">
              <div>
                <span>Status</span>
                <strong>{paymentData?.status || "Pending"}</strong>
              </div>

              <div>
                <span>Order ID</span>
                <strong>{orderId}</strong>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>Payment Not Confirmed</h1>
            <p>
              We could not confirm your payment. Please contact support or try
              again.
            </p>

            <div className="qonoq-success__line" />

            <div className="qonoq-success__info">
              <div>
                <span>Status</span>
                <strong>{paymentData?.status || status}</strong>
              </div>

              <div>
                <span>Order ID</span>
                <strong>{orderId || "Not found"}</strong>
              </div>

              {error ? (
                <div>
                  <span>Error</span>
                  <strong>{error}</strong>
                </div>
              ) : null}
            </div>
          </>
        )}

        <div className="qonoq-success__buttons">
          <button onClick={() => navigate("/")}>Home</button>
          <button className="outline" onClick={() => navigate("/")}>
            New Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import { Routes, Route } from "react-router-dom";

import Capsules from "./components/capsules/Capsules";
import Footer from "./components/footer/Footer";
import Gallery from "./components/gallery/Gallery";
import Header from "./components/header/Header";
import Nav from "./components/nav/Nav";
import Qonoq from "./components/qonoq/Qonoq";
import "./i18n";
import Capsule from "./pages/capsule/Capsule";
import Rules from "./pages/rules/Rules";
import Service from "./pages/service/Service";
import Contact from "./pages/contact/Contact";
import MyBooking from "./pages/mybooking/MyBooking";
import Login from "./pages/admin/login/Login";
import Data from "./pages/admin/data/Data";
import CapsuleAdmin from "./pages/admin1/CapsuleAdmin";
import CapsuleAdminLogin from "./pages/admin1/CapsuleAdminLogin";

import PaymentSuccess from "./pages/payment/PaymentSuccess";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Qonoq />
              <Capsules />
              <Gallery />
            </>
          }
        />
        <Route path="/capsule" element={<Capsule />} />
        <Route
          path="/tashkent-airport"
          element={<Capsule forcedBranchKey="tashkent_airport" />}
        />
        <Route
          path="/samarkand-airport"
          element={<Capsule forcedBranchKey="samarkand_airport" />}
        />
        <Route
          path="/samarkand-railway"
          element={<Capsule forcedBranchKey="samarkand_railway" />}
        />
        <Route path="/rules" element={<Rules />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="ad2007" element={<Login />} />
        <Route path="data1212" element={<Data />} />

        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/admin033" element={<CapsuleAdmin />} />
        <Route path="/admin/login" element={<CapsuleAdminLogin />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;

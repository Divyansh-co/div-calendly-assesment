import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingPage } from "./pages/BookingPage";
import { DetailsPage } from "./pages/DetailsPage";
import { ConfirmedPage } from "./pages/ConfirmedPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/book/:slotIso" element={<DetailsPage />} />
        <Route path="/confirmed/:bookingId" element={<ConfirmedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

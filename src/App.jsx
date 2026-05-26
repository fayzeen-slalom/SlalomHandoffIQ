import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeliveryReadiness from "./DeliveryReadiness";
import About from "./About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DeliveryReadiness />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

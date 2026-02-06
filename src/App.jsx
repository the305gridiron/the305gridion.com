import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import Offseason from "./pages/Offseason";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draft/*" element={<Draft />} />
        <Route path="/offseason/*" element={<Offseason />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

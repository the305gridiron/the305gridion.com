import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import Offseason from "./pages/Offseason";
import Layout from "./components/Layout";

import "./styles/main.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/draft/*" element={<Draft />} />
          <Route path="/offseason/*" element={<Offseason />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

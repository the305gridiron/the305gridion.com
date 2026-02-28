import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import BigBoard from "./pages/BigBoard";
import MockDrafts from "./pages/MockDrafts";
import DraftResults from "./pages/DraftResults";
import Transactions from "./pages/Transactions";

import "./styles/main.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/prospects/*' element={<BigBoard />} />
                    <Route path='/mocks/*' element={<MockDrafts />} />
                    <Route path='/drafts/*' element={<DraftResults />} />
                    <Route path='/offseason/*' element={<Transactions />} />
                    <Route path='/transactions/*' element={<Transactions />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Home,
    BigBoard,
    MockDrafts,
    DraftResults,
    Transactions,
} from "./pages";
import { Layout } from "./components/layout";

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

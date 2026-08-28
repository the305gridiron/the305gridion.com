import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Home,
    BigBoard,
    MockDrafts,
    Roster,
    DraftResults,
    Transactions,
    Schedule,
} from "./pages";
import { Layout } from "./components/layout";
import { AuthProvider } from "./admin/AuthContext";
import ProtectedRoute from "./admin/ProtectedRoute";

import "./styles/main.css";

// Not linked from anywhere in the site nav — reachable only if you know to
// go to /admin or /login directly. /admin redirects to /login when signed out.
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path='/prospects/*' element={<BigBoard />} />
                        <Route path='/mocks/*' element={<MockDrafts />} />
                        <Route path='/drafts/*' element={<DraftResults />} />
                        <Route path='/offseason/*' element={<Transactions />} />
                        <Route path='/transactions/*' element={<Transactions />} />
                        <Route path='/roster/*' element={<Roster />} />
                        <Route path='/schedule/*' element={<Schedule />} />
                        <Route
                            path='/login'
                            element={
                                <Suspense fallback={null}>
                                    <Login />
                                </Suspense>
                            }
                        />
                        <Route
                            path='/admin/*'
                            element={
                                <Suspense fallback={null}>
                                    <ProtectedRoute>
                                        <Admin />
                                    </ProtectedRoute>
                                </Suspense>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

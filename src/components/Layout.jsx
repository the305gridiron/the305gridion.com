import { Outlet, Links } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/draft">2026 Big Board</Link>
                <Link to="/offseason">Offseason Tracker</Link>
            </nav>

            <Outlet />
        </>
    );
}
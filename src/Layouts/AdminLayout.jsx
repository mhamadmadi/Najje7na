import { Outlet, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useState } from "react";
import "./AdminLayout.css";

function AdminLayout(){
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    }

    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="admin-layout">
            <div className="admin-topbar">
                <Link to="/admin/dashboard" onClick={closeMenu}>
                    <img src="/images/Najje7na logo.jpeg" className="admin-logo" alt="Logo"/>
                </Link>
                <i className="bi bi-list admin-toggle" onClick={() => setMenuOpen(!menuOpen)}></i>
            </div>

            <aside className={menuOpen ? "admin-sidebar active" : "admin-sidebar"}>
                <Link to="/admin/dashboard" onClick={closeMenu} className="sidebar-logo-link">
                    <img src="/images/Najje7na logo.jpeg" className="admin-logo" alt="Logo"/>
                </Link>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" onClick={closeMenu}>Home</Link>
                    <Link to="/admin/users" onClick={closeMenu}>Students</Link>
                    <Link to="/admin/messages" onClick={closeMenu}>Requests</Link>
                    <Link to="/admin/courses" onClick={closeMenu}>Courses</Link>
                    <Link to="/admin/enrollments" onClick={closeMenu}>Enrollments</Link>
                    <Link to="/admin/enrollment-history">Enrollments History</Link>
                    <Link to="/admin/feedback"><i className="bi bi-chat-quote"></i>Feedback</Link>
                </nav>
                <span className="admin-logout" onClick={handleLogout}>Logout</span>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout;
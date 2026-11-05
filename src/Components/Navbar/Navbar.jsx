import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";

function Navbar(){
    const [menuOpen, setMenuOpen] = useState(false);
    const [coursesOpen, setCoursesOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    const closeMenu = () => {
        setMenuOpen(false);
        setCoursesOpen(false);
        setProfileOpen(false);
    }

    const handleLogout = async () => {
        await signOut(auth);
        closeMenu();
        navigate("/");
    }

    return(
        <nav>
        <div className="logo">
            <Link to="/" className="Logo" onClick={closeMenu}>
                <img src="/images/Najje7na logo.jpeg" alt="Logo"/>
            </Link>
        </div>
            <ul className={menuOpen ? "nav-links active" : "nav-links"}>
                <li><Link to="/" onClick={closeMenu}>HOME</Link></li>
                <li><Link to="/About" onClick={closeMenu}>ABOUT US</Link></li>
                <li><Link to="/Universities" onClick={closeMenu}>UNIVERSITIES</Link></li>
                <li className="has-dropdown">
                    <span className="dropdown-label" onClick={() => setCoursesOpen(!coursesOpen)}>COURSES</span>
                    <ul className={coursesOpen ? "nav-list-courses active" : "nav-list-courses"}>
                        <li><Link to="/courses/general" onClick={closeMenu}>General Preparation Courses</Link></li>
                        <li><Link to="/courses/mis" onClick={closeMenu}>MIS Courses</Link></li>
                        <li><Link to="/courses/accounting" onClick={closeMenu}>Accounting Courses</Link></li>
                        <li><Link to="/courses/finance" onClick={closeMenu}>Finance Courses</Link></li>
                        <li><Link to="/courses/economics" onClick={closeMenu}>Economic Courses</Link></li>
                    </ul>
                </li>
                {currentUser ? (
                    <li className="has-dropdown">
                        <span
                            className="dropdown-label profile-label"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            {userData?.name || "Account"}
                        </span>
                        <ul className={profileOpen ? "nav-list-courses active" : "nav-list-courses"}>
                            <li><Link to="/Profile" onClick={closeMenu}>Profile</Link></li>
                            <li><Link to="/my-courses" onClick={closeMenu}>My Courses</Link></li>
                            <li>
                                <span className="logout-btn" onClick={handleLogout}>Logout</span>
                            </li>
                        </ul>
                    </li>
                ) : (
                    <li><Link to="/Login" className="login-nav" onClick={closeMenu}>LOGIN</Link></li>
                )}
            </ul>
            <i className="bi bi-list" onClick={() => setMenuOpen(!menuOpen)}></i>
    </nav>
    )
}

export default Navbar;
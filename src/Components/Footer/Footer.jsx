import "./Footer.css"
import { Link } from "react-router-dom"

function Footer(){
    return(
        <footer className="footer">
            <div className="footer-container">

            <div className="footer-section">
                <Link to="/" className="Logo">
                    <img src="/images/Najje7na logo.jpeg" alt="logo"/>
                </Link>
            </div>

            <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/About">About Us</Link></li>
                <li><Link to="/Universities">Universities</Link></li>
                <li>
                    <ul className="courses-flex">
                        <li><Link to="/courses/general">General Preparation Courses</Link></li>
                        <li><Link to="/courses/mis">MIS Courses</Link></li>
                        <li><Link to="/courses/accounting">Accounting Courses</Link></li>
                        <li><Link to="/courses/finance">Finance Courses</Link></li>
                        <li><Link to="/courses/economics">Economic Courses</Link></li>
                    </ul>
                </li>
            </ul>
            </div>

            <div className="footer-section">
                <h3>Contact</h3>
                <p>Email: <a href="mailto:najjje7ne.academy@gmail.com" target="_blank">najje7na.edu@gmail.com</a></p>
                <p>Phone: <a href="https://wa.me/96170958759" target="_blank">+961 70/958 759</a></p>
            </div>

            </div>

            <div className="footer-bottom">
                <p>© 2026 Najjehna. All rights reserved.</p>
                <p className="signature">Designed & Developed by Mohammad Madi</p>
            </div>
        </footer>
    )
}
export default Footer
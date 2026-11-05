import { Link } from "react-router-dom";
import universities from "../../data/Universitiesdata";
import { useAuth } from "../../context/AuthContext";
import Feedback from "../../Components/Feedback/Feedback";
import "./home.css";

function Home(){
    const { currentUser } = useAuth();

    return(
        <>
    {/* Hero Section */}
    <section className="header-section">
        <div className="header-container">
            <div className="header-title">
                <h1>ONLINE EDUCATION ACADEMY</h1>
                <p>Study Smarter . Not Harder</p>
                {!currentUser && (
                <Link to={'/Login'}>
                <button>Start Learning Today</button>
                </Link>
                )}
            </div>
        </div>
    </section>
    {/* End Hero Section */}

    {/* About Section */}
    <section className="about-section" id="about">
        <div className="about-title">
            <h1>ABOUT US</h1>
        </div>
        <div className="about-container">
            <div className="about-content">
                <strong>WELCOME TO NAJJE7NA</strong>
                <p>Your all-in-one learning platform for school and university students.</p>
                <p>At Najjje7na, we simplify complex subjects and turn them into clear, easy-to-understand lessons. Our goal is to help students learn with confidence, practice effectively, and succeed in their exams.</p>
                <p>✔ Simple explanations</p>
                <p>✔ Step-by-step examples</p>
                <p>✔ Designed for real students</p>
            </div>
            <div className="about-image">
                <img src="/images/Boy.jpg" alt="about image"/>
            </div>
        </div>
    </section>
    {/* End About Section */}

    {/* Universities Section */}
    <section className="university-section" id="university">
        <div className="university-title">
            <h1>OUR UNIVERSITIES</h1>
        </div>
        <div className="university-card">
            {universities.map((uni) => (
                <div className="university-item" key={uni.path}>
                <img src={uni.image} alt={uni.name}/>
                <h2>{uni.name}</h2>
                {uni.available ? (
                <Link to={`/university/${uni.path}`}>See Courses</Link>
                ) : (<span className="coming-soon">Coming Soon</span>) }
            </div>
            ))}
        </div>
    </section>
    {/* End Universities Section */}

    {/* Journey Section */}
    <section className="journey-section">
        <div className="journey-title">
            <h1>Start Your Journey</h1>
            <p>Joining the Najje7na Community is simple. Follow these three steps to unlock your potential</p>
        </div>
        <div className="journey-card">
            <div className="journey-item">
                <i className="bi bi-person-add"></i>
                <h3>Create Account</h3>
                <p>Register with your details to join our student database and access the dashboard</p>
            </div>
            <div className="journey-item">
                <i className="bi bi-check-lg"></i>
                <h3>Get Approved</h3>
                <p>Our team verifies your account to ensure you are placed in the correct academic track</p>
            </div>
            <div className="journey-item">
                <i className="bi bi-mortarboard-fill"></i>
                <h3>Start Learning</h3>
                <p>Access your lectures, join the discussion groups, and start your path to success</p>
            </div>
        </div>
    </section>
    {/* End Journey Section */}

    {/* Feedback Section */}
            <Feedback />
    {/* End Feedback Section */}

    {/* Contact Section */}
    <section className="contact-section">
        <div className="contact-title">
            <h1>CONTACT US</h1>
            <p>We are here to help you. Reach out to us anytime.</p>
        </div>
        <div className="contact-social">
            <div className="contact-item">
                <i className="bi bi-envelope-at-fill"></i>
                <h3>Email</h3>
                <p><a href="mailto:najjje7ne.academy@gmail.com" target="_blank">najje7na.edu@gmail.com</a></p>
            </div>
            <div className="contact-item">
                <i className="bi bi-telephone-fill"></i>
                <h3>Whatsapp</h3>
                <p><a href="https://wa.me/96170958759" target="_blank">70/958759</a></p>
            </div>
            <div className="contact-item">
                <i className="bi bi-instagram"></i>
                <h3>Instagram</h3>
                <p><a href="https://www.instagram.com/najje7na/" target="_blank">najje7na</a></p>
            </div>
        </div>
    </section>
    {/* End Contact Section */}
        </>
    )
}

export default Home;
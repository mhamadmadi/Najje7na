import Navbar from "../Components/Navbar/Navbar.jsx";
import Footer from "../Components/Footer/Footer.jsx";
import Home from "../Pages/Home/home.jsx";
import About from "../Pages/About/About.jsx";
import CourseCard from "../Components/CourseCard/CourseCard.jsx"
import Courses from "../Pages/Courses/Courses.jsx";
import CourseDetails from "../Pages/CourseDetails/CourseDetails.jsx";
import LogInForm from "../Pages/LogIn/Login.jsx";
import SignUpForm from "../Pages/Sign Up/Signup.jsx";
import Contact from "../Pages/Contact/Contact.jsx";
import Majors from "../Pages/Majors/Majors.jsx";
import Universities from "../Pages/Universities/Universities.jsx";
import Profile from "../Pages/Profile/Profile.jsx";
import MyCourses from "../Pages/MyCourses/MyCourses.jsx";
import LessonPlayer from "../Pages/LessonPlayer/LessonPlayer.jsx";
import StudentAgreement from "../Components/StudentAgreement/StudentAgreement.jsx";
import { Routes, Route } from "react-router-dom";

function PublicLayout(){
    return (
        <>
            <StudentAgreement />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses/:majorPath" element={<Courses />} />
                <Route path="/courses/:university/:major" element={<Courses />}/>
                <Route path="/course/:id" element={<CourseDetails />} />
                <Route path="/Login" element={<LogInForm />} />
                <Route path="/Signup" element={<SignUpForm />} />
                <Route path="/Universities" element={<Universities />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/university/:id" element={<Majors/>} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/course/:id/lesson/:sectionId/:lessonId" element={<LessonPlayer />} />
            </Routes>
            <Footer />
        </>
    )
}

export default PublicLayout;
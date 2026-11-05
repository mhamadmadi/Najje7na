import "./Courses.css";
import CourseCard from "../../Components/CourseCard/CourseCard";
import majors from "../../data/Majorsdata";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";

function Courses(){
    const { currentUser } = useAuth();
    const { majorPath } = useParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentMajor = majors.find(m => m.path === majorPath);

    useEffect(() => {
        if (!currentMajor) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, "courses"), where("major", "==", currentMajor.path));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setCourses(list);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching courses:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [majorPath]);

    if(!currentMajor) return <h2>Major not found</h2>

    return (
        <>
        <section className="hero-section">
            <div className="hero-container">
                <div className="hero-content">
                    <h1>Achieve your academic goals with Najjehna</h1>
                    <p>Learn step by step and master your courses with expert guidance</p>
                    {!currentUser && (
                        <Link to={"/Login"}>
                        <button>Start now</button>
                        </Link>
                    )}
                </div>
                <div className="hero-image">
                    <img src="/images/courses_image_header.jpeg" alt="courses_image_header"/>
                </div>
            </div>
        </section>

        <section className="card-section">
            <div className="card-title">
                <h1>{currentMajor.name}</h1>
            </div>
            <div className="card-grid">
                {loading ? (
                    <p>Loading courses...</p>
                ) : 
                courses.length > 0 ? (
                    courses.map(course => (
                        <CourseCard
                            id={course.id}
                            title={course.title}
                            image={course.image}
                            key={course.id}
                        />
                    ))
                ) : (
                    <p>No courses available yet for this major.</p>
                )}
            </div>
        </section>
        </>
    )
}

export default Courses;
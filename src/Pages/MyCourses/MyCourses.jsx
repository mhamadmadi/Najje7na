import "./MyCourses.css";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function MyCourses(){
    const { currentUser } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, "enrollments"), where("userId", "==", currentUser.uid));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const enrollments = snapshot.docs.map(d => d.data());

            const matched = await Promise.all(enrollments.map(async (enrollment) => {
                try {
                    const courseSnap = await getDoc(doc(db, "courses", String(enrollment.courseId)));
                    if (courseSnap.exists()) {
                        return { id: courseSnap.id, ...courseSnap.data(), accessLevel: enrollment.accessLevel };
                    }
                } catch (err) {
                    console.error("Error fetching course:", err);
                }
                return null;
            }));

            setEnrolledCourses(matched.filter(Boolean));
            setLoading(false);
        }, (error) => {
            console.error("Error fetching enrollments:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return(
        <div className="mycourses-page">
            <h1>My Courses</h1>

            {loading ? (
                <p className="mycourses-note">Loading your courses...</p>
            ) : enrolledCourses.length === 0 ? (
                <p className="mycourses-note">You haven't enrolled in any courses yet.</p>
            ) : (
                <div className="mycourses-grid">
                    {enrolledCourses.map(course => (
                        <Link to={`/course/${course.id}`} className="mycourse-card" key={course.id}>
                            <img src={course.image} alt={course.title} />
                            <h3>{course.title}</h3>
                            <span className={`access-badge ${course.accessLevel}`}>
                                {course.accessLevel === "full" ? "Full Access" : course.accessLevel === "final" ? "Final Access" : "Partial Access"}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyCourses;
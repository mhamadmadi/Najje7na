import { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./AdminEnrollments.css";

function AdminEnrollments(){
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [accessLevel, setAccessLevel] = useState("partial");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            const q = query(collection(db, "users"), where("role", "==", "student"));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setStudents(list);
        };
        fetchStudents();

        const unsubCourses = onSnapshot(collection(db, "courses"), (snapshot) => {
            setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        return () => unsubCourses();
    }, []);

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!selectedStudent || !selectedCourse) {
            setErrorMessage("Please select both a student and a course.");
            return;
        }

        setLoading(true);
        try {
            const enrollmentId = `${selectedStudent}_${selectedCourse}`;
            await setDoc(doc(db, "enrollments", enrollmentId), {
                userId: selectedStudent,
                courseId: selectedCourse,
                accessLevel: accessLevel,
                grantedAt: serverTimestamp(),
            });
            setSuccessMessage("Access granted successfully!");
            setSelectedStudent("");
            setSelectedCourse("");
            setAccessLevel("partial");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-enrollments">
            <h1>Grant Course Access</h1>

            <form onSubmit={handleGrantAccess} className="enrollment-form">
                <div className="form-input">
                    <label htmlFor="student">Student</label>
                    <select
                        id="student"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                        <option value="">Select a student</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-input">
                    <label htmlFor="course">Course</label>
                    <select
                        id="course"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Select a course</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-input">
                    <label htmlFor="accessLevel">Access Level</label>
                    <select
                        id="accessLevel"
                        value={accessLevel}
                        onChange={(e) => setAccessLevel(e.target.value)}
                    >
                        <option value="partial">Partial (midterm)</option>
                        <option value="final">Final (final access)</option>
                        <option value="full">Full (full access)</option>
                    </select>
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Granting..." : "Grant Access"}
                </button>
            </form>
        </div>
    )
}

export default AdminEnrollments;

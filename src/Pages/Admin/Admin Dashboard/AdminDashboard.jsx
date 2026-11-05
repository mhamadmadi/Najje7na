import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, deleteDoc, orderBy} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../../firebaseConfig";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [studentCount, setStudentCount] = useState(0);
    const [enrollmentCount, setEnrollmentCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const studentsQuery = query(
            collection(db, "users"),
            where("role", "==", "student")
        );

        const unsubStudents = onSnapshot(studentsQuery, (snapshot) => {
            setStudentCount(snapshot.size);
            setLoading(false);
        });

        const unsubEnrollments = onSnapshot(
            collection(db, "enrollments"),
            (snapshot) => {
                setEnrollmentCount(snapshot.size);
            }
        );

        const unsubCourses = onSnapshot(
            collection(db, "courses"),
            (snapshot) => {
                setCourseCount(snapshot.size);
            }
        );

        return () => {
            unsubStudents();
            unsubEnrollments();
            unsubCourses();
        };
    }, []);

    useEffect(() => {
        const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(d => ({id: d.id, ...d.data()}));

            setMessages(list);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this message?")) return;

        try {
            await deleteDoc(doc(db, "contactMessages", id));
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <>
            {/* Dashboard */}
            <div className="admin-dashboard">
                <h1>Dashboard</h1>

                {loading ? (
                    <p>Loading stats...</p>
                ) : (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">
                                {studentCount}
                            </span>
                            <span className="stat-label">
                                Total Students
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-number">
                                {courseCount}
                            </span>
                            <span className="stat-label">
                                Total Courses
                            </span>
                        </div>

                        <div className="stat-card">
                            <span className="stat-number">
                                {enrollmentCount}
                            </span>
                            <span className="stat-label">
                                Total Enrollments
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Pending Requests */}
            <div className="admin-messages">
                <h1>Pending Student Approvals</h1>

                {loading ? (
                    <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p>No messages yet.</p>
                ) : (
                    <div className="table-scroll">
                        <table className="messages-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Type</th>
                                    <th>Payment</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {messages.map(msg => (
                                    <tr key={msg.id}>
                                        <td>{msg.name}</td>
                                        <td>{msg.email}</td>
                                        <td>{msg.phone}</td>
                                        <td>{msg.course}</td>
                                        <td>
                                            {msg.accessLevel && (
                                                <span className={`access-badge ${msg.accessLevel}`}>
                                                    {msg.accessLevel === "partial" ? "Partial" : msg.accessLevel === "final" ? "Final" : "Full"}
                                                </span>
                                            )}
                                        </td>
                                        <td>{msg.paymentMethod || "—"}</td>
                                        <td>
                                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : "—"}
                                        </td>
                                        <td>
                                            <button className="delete-btn" onClick={() => handleDelete(msg.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminDashboard;

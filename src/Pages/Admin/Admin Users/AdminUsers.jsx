
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot} from "firebase/firestore";
import { getFunctions, httpsCallable} from "firebase/functions";
import { db } from "../../../firebaseConfig";
import "./AdminUsers.css";

function AdminUsers() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const functions = getFunctions();
    const deleteStudentAccount = httpsCallable(functions, "deleteStudent");

    useEffect(() => {
        const q = query(collection(db, "users"), where("role", "==", "student"));

        const unsub = onSnapshot(q, (snapshot) => {
                setStudents(
                    snapshot.docs.map((d) => ({
                        id: d.id,
                        ...d.data()
                    }))
                );

                setLoading(false);
            },
            (error) => {
                console.error("Error fetching students:", error);
                setLoading(false);
            }
        );
        return () => unsub();
    }, []);

    const handleDelete = async (studentId, studentName) => {
        const confirmed = window.confirm(
            `Are you sure you want to permanently delete ${
                studentName || "this student"
            }?

This will remove:
- Firebase Authentication account
- Student Firestore profile
- All course enrollment records

This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(studentId);

        try {
            const result = await deleteStudentAccount({studentId});
            if (result.data.success) {
                alert("Student deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            alert(error.message || "Failed to remove student.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="admin-users">
            <h1>Students</h1>

            {loading ? (
                <p>Loading students...</p>
            ) : students.length === 0 ? (
                <p>No students registered yet.</p>
            ) : (
                <div className="table-scroll">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.name || "—"}</td>
                                    <td>{s.email}</td>
                                    <td>{s.phone || "—"}</td>
                                    <td>{s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : "—"}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDelete(s.id, s.name)} disabled={deletingId === s.id}>
                                            {deletingId === s.id ? "Removing..." : "Remove user"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;

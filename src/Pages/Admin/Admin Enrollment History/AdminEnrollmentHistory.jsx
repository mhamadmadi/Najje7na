import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import * as XLSX from "xlsx";
import "./AdminEnrollmentHistory.css";

function AdminEnrollmentHistory(){
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "enrollments"), async (snapshot) => {
            const rows = await Promise.all(snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                let courseTitle = "Unknown course";
                try {
                    const courseSnap = await getDoc(doc(db, "courses", String(data.courseId)));
                    if (courseSnap.exists()) courseTitle = courseSnap.data().title;
                } catch (err) {
                    console.error("Error fetching course:", err);
                }

                let studentInfo = { name: "Unknown", email: "Unknown" };
                try {
                    const userSnap = await getDoc(doc(db, "users", data.userId));
                    if (userSnap.exists()) {
                        studentInfo = userSnap.data();
                    }
                } catch (err) {
                    console.error("Error fetching student info:", err);
                }

                return {
                    id: docSnap.id,
                    studentName: studentInfo.name,
                    studentEmail: studentInfo.email,
                    courseTitle: courseTitle,
                    accessLevel: data.accessLevel,
                    grantedAt: data.grantedAt?.toDate ? data.grantedAt.toDate() : null,
                };
            }));

            rows.sort((a, b) => (b.grantedAt || 0) - (a.grantedAt || 0));
            setEnrollments(rows);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const handleDelete = async (enrollmentId, studentName, courseTitle) => {
        if (!window.confirm(`Remove ${studentName}'s access to "${courseTitle}"?`)) return;
        setDeletingId(enrollmentId);
        try {
            await deleteDoc(doc(db, "enrollments", enrollmentId));
        } catch (error) {
            console.error("Error deleting enrollment:", error);
            alert("Failed to remove access. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleExport = () => {
        const exportData = enrollments.map(e => ({
            "Student Name": e.studentName,
            "Email": e.studentEmail,
            "Course": e.courseTitle,
            "Access Level": e.accessLevel === "full" ? "Full" : e.accessLevel === "final" ? "Final" : "Partial",
            "Enrollment Date": e.grantedAt ? e.grantedAt.toLocaleDateString() : "—",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Enrollments");

        const colWidths = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, ...exportData.map(row => String(row[key]).length)) + 2
        }));
        worksheet["!cols"] = colWidths;

        const today = new Date().toISOString().split("T")[0];
        XLSX.writeFile(workbook, `Najjehne-Enrollments-${today}.xlsx`);
    };

    return (
        <div className="admin-enrollment-history">
            <h1>Enrollment History</h1>
            {enrollments.length > 0 && (
                    <button className="export-btn" onClick={handleExport}>
                        <i className="bi bi-file-earmark-spreadsheet"></i> Export to Excel
                    </button>
                )}

            {loading ? (
                <p>Loading enrollments...</p>
            ) : enrollments.length === 0 ? (
                <p>No enrollments yet.</p>
            ) : (
                <div className="table-scroll">
                    <table className="enrollments-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Access</th>
                                <th>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map(e => (
                                <tr key={e.id}>
                                    <td>{e.studentName}</td>
                                    <td>{e.studentEmail}</td>
                                    <td>{e.courseTitle}</td>
                                    <td>
                                        <span className={`access-badge ${e.accessLevel}`}>
                                            {e.accessLevel === "full" ? "Full" : e.accessLevel === "final" ? "Final" : "Partial"}
                                        </span>
                                    </td>
                                    <td>{e.grantedAt ? e.grantedAt.toLocaleDateString() : "—"}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(e.id, e.studentName, e.courseTitle)}
                                            disabled={deletingId === e.id}
                                        >
                                            {deletingId === e.id ? "Removing..." : "Remove Access"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default AdminEnrollmentHistory;
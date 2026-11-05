import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./FeedbackManagement.css";

function FeedbackManagement() {
    const [studentName, setStudentName] = useState("");
    const [message, setMessage] = useState("");
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const feedbackRef = collection(db, "feedbacks");
        const q = query(feedbackRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((document) => ({
                    id: document.id, ...document.data()
                }));
                setFeedbacks(data);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentName.trim() || !message.trim()) {
            alert("Please enter student name and feedback.");
            return;
        }

        try {
            setLoading(true);
            await addDoc(
                collection(db, "feedbacks"),
                {
                    studentName: studentName.trim(),
                    message: message.trim(),
                    active: true,
                    createdAt: serverTimestamp()
                }
            );

            setStudentName("");
            setMessage("");
        } catch (error) {
            console.error("Error adding feedback:", error);
            alert("Could not add feedback.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (feedbackId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
        if (!confirmDelete) {
            return;
        }

        try {
            await deleteDoc(
                doc(db, "feedbacks", feedbackId)
            );
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    const toggleFeedback = async (feedback) => {
        try {
            await updateDoc(doc(db, "feedbacks", feedback.id), {active: feedback.active === false});
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
    };

    return (
        <div className="feedback-admin-page">
            <div className="feedback-admin-header">
                <h1>Student Feedback</h1>
            </div>

            {/* ADD FEEDBACK */}
            <div className="add-feedback-card">
                <h2>Add Feedback</h2>
                <form onSubmit={handleSubmit}>
                    <div className="feedback-form-group">
                        <label>Student Name</label>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) =>
                                setStudentName(e.target.value)
                            }
                            placeholder="Enter student name"
                            maxLength={100}
                        />
                    </div>
                    <div className="feedback-form-group">
                        <label>Student Message</label>
                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            placeholder="Enter student feedback..."
                            rows="5"
                            maxLength={500}
                        />
                        <span className="character-count">{message.length}/500</span>
                    </div>
                    <button type="submit" className="add-feedback-button" disabled={loading}>
                        {loading ? "Adding..." : "Add Feedback"}
                    </button>
                </form>
            </div>

            {/* EXISTING FEEDBACK */}
            <div className="admin-feedback-list">
                <h2>Existing Feedback</h2>
                {feedbacks.length === 0 ? (
                    <p className="no-feedback">No feedback added yet.</p>
                ) : (
                    feedbacks.map((feedback) => (
                        <div className="admin-feedback-item" key={feedback.id}>
                            <div className="admin-feedback-content">
                                <h3>{feedback.studentName}</h3>
                                <p>{feedback.message}</p>
                            </div>
                            <div className="admin-feedback-actions">
                                <button className={feedback.active === false ? "show-feedback-button" : "hide-feedback-button"} onClick={() => toggleFeedback(feedback)}>
                                    <i className={feedback.active === false? "bi bi-eye" : "bi bi-eye-slash"}></i>
                                    {feedback.active === false ? " Show" : " Hide"}
                                </button>
                                <button className="delete-feedback-button" onClick={() => handleDelete(feedback.id)}>
                                    <i className="bi bi-trash"></i>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FeedbackManagement;
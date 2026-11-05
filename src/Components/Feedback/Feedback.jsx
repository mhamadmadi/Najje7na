import "./Feedback.css";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";

function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const feedbackRef = collection(db, "feedbacks");
        const q = query(feedbackRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const feedbackData = snapshot.docs
                .map((doc) => ({
                    id: doc.id, ...doc.data()
                })).filter((feedback) => feedback.active !== false);
                setFeedbacks(feedbackData);
                setLoading(false);
            },
            (error) => {
                console.error("Error loading feedback:",error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    if (loading) {
        return null;
    }

    if (feedbacks.length === 0) {
        return null;
    }

    return (
        <section className="feedback-section">
            <div className="feedback-header">
                <h2>What Our Students Say</h2>
                <p>See what our students have to say about their learning experience with Najje7na.</p>
            </div>
            <div className="feedback-container">
                {feedbacks.map((feedback) => (
                    <div className="feedback-card" key={feedback.id}>
                        <div className="quote-icon">
                            <i className="bi bi-quote"></i>
                        </div>
                        <p className="feedback-message">"{feedback.message}"</p>
                        <div className="feedback-student">
                            <div className="student-avatar">
                                {feedback.studentName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="student-info">
                                <h4>{feedback.studentName}</h4>
                                <span>Najje7na Student</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Feedback;
import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./AdminMessages.css";

function AdminMessages(){
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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
        <div className="admin-messages">
            <h1>Enrollment Requests</h1>

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
                                    <td>{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : "—"}</td>
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
    )
}

export default AdminMessages;
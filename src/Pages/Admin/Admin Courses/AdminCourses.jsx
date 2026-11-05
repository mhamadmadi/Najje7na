import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import "./AdminCourses.css";

function AdminCourses(){
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "courses"), (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setCourses(list);
            setLoading(false);
        });
        return () => unsub();
    }, []);
    
    return (
        <div className="admin-courses">
            <h1>Courses</h1>
            <Link to="/admin/courses/new" className="add-course-btn">+ Add New Course</Link>
            <div className="table-scroll">
                <table className="courses-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Major</th>
                            <th>Language</th>
                            <th>Partial Price</th>
                            <th>Final Price</th>
                            <th>Full Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id}>
                                <td>{c.title}</td>
                                <td>{c.major}</td>
                                <td>{c.language || "—"}</td>
                                <td>${c.pricePartial}</td>
                                <td>${c.priceFinal}</td>
                                <td>${c.priceFull}</td>
                                <td>
                                    <Link to={`/admin/courses/${c.id}/edit`} className="manage-link">Edit</Link>
                                    {" · "}
                                    <Link to={`/admin/courses/${c.id}`} className="manage-link">
                                        Manage Videos
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminCourses;
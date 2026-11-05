import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../firebaseConfig";
import "./AdminCourseModules.css";

function AdminCourseModules(){
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [courseLoading, setCourseLoading] = useState(true);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingLessonKey, setSavingLessonKey] = useState(null);
    const storage = getStorage();
    const [uploadingKey, setUploadingKey] = useState(null);
    const [whatsappLink, setWhatsappLink] = useState("");
    const [savingWhatsapp, setSavingWhatsapp] = useState(false);
    const [showNewSectionForm, setShowNewSectionForm] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState("");
    const [newSectionFree, setNewSectionFree] = useState(false);
    const [newSectionExamPeriod, setNewSectionExamPeriod] = useState("partial");
    const [newLessonTitle, setNewLessonTitle] = useState({});

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const snap = await getDoc(doc(db, "courses", id));
                setCourse(snap.exists() ? { id: snap.id, ...snap.data() } : null);
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setCourseLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const fetchSections = async () => {
        const sectionsRef = collection(db, "courseModules", id, "sections");
        const q = query(sectionsRef, orderBy("order"));
        const snapshot = await getDocs(q);
        setSections(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchSections();
    }, [id]);

    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSectionTitle.trim()) return;

        const nextOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order || 0)) + 1 : 1;
        const nextId = sections.length > 0 ? String(Math.max(...sections.map(s => Number(s.id) || 0)) + 1) : "1";

        try {
            await setDoc(doc(db, "courseModules", id, "sections", nextId), {
                title: newSectionTitle.trim(),
                order: nextOrder,
                free: newSectionFree,
                examPeriod: newSectionExamPeriod,
                lessons: [],
            });
            setNewSectionTitle("");
            setNewSectionFree(false);
            setNewSectionExamPeriod("partial");
            setShowNewSectionForm(false);
            fetchSections();
        } catch (error) {
            console.error("Error adding section:", error);
        }
    };

    const handleDeleteSection = async (sectionId, sectionTitle) => {
    if (!window.confirm(`Delete section "${sectionTitle}"? This removes all its lessons too.`)) return;
    try {
        await deleteDoc(doc(db, "courseModules", id, "sections", sectionId));
        fetchSections();
    } catch (error) {
        console.error("Error deleting section:", error);
    }
    };   

    const handleAddLesson = async (sectionId) => {
        const title = (newLessonTitle[sectionId] || "").trim();
        if (!title) return;

        const section = sections.find(s => s.id === sectionId);
        const nextLessonId = section.lessons.length > 0
            ? Math.max(...section.lessons.map(l => l.id)) + 1
            : 1;

        const updatedLessons = [...section.lessons, { id: nextLessonId, title, bunnyVideoId: "", documentUrl: "" }];

        try {
            await updateDoc(doc(db, "courseModules", id, "sections", sectionId), {
                lessons: updatedLessons
            });
            setNewLessonTitle(prev => ({ ...prev, [sectionId]: "" }));
            fetchSections();
        } catch (error) {
            console.error("Error adding lesson:", error);
        }
    };

    const handleDeleteLesson = async (sectionId, lessonId, lessonTitle) => {
    if (!window.confirm(`Delete lesson "${lessonTitle}"?`)) return;
    const section = sections.find(s => s.id === sectionId);
    const updatedLessons = section.lessons.filter(l => l.id !== lessonId);

    try {
        await updateDoc(doc(db, "courseModules", id, "sections", sectionId), {
            lessons: updatedLessons
        });
        setSections(prev => prev.map(s => s.id === sectionId ? { ...s, lessons: updatedLessons } : s));
    } catch (error) {
        console.error("Error deleting lesson:", error);
    }
    };

    const handleLessonTitleChange = (sectionId, lessonId, newTitle) => {
    setSections(prev => prev.map(section => {
        if (section.id !== sectionId) return section;
        return {
            ...section,
            lessons: section.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, title: newTitle } : lesson
            )
        };
    }));
    };

    const handleBunnyVideoIdChange = (sectionId, lessonId, newValue) => {
    setSections(prev => prev.map(section => {
        if (section.id !== sectionId) return section;

        return {
            ...section,
            lessons: section.lessons.map(lesson =>
                lesson.id === lessonId
                    ? { ...lesson, bunnyVideoId: newValue.trim() }
                    : lesson
            )
        };
    }));
};

    const handleSave = async (sectionId) => {
        const section = sections.find(s => s.id === sectionId);
        setSavingLessonKey(sectionId);
        try {
            await updateDoc(doc(db, "courseModules", id, "sections", sectionId), {
                lessons: section.lessons
            });
        } catch (error) {
            console.error("Error saving lessons:", error);
        } finally {
            setSavingLessonKey(null);
        }
    };

    const handleFileUpload = async (sectionId, lessonId, examPeriod, file) => {
        if (!file) return;
        const uploadKey = `${sectionId}_${lessonId}`;
        setUploadingKey(uploadKey);
        try {
            const filePath = `courseDocuments/${id}/${examPeriod}/${sectionId}_${lessonId}_${file.name}`;
            const storageRef = ref(storage, filePath);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            const section = sections.find(s => s.id === sectionId);
            const updatedLessons = section.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, documentUrl: downloadUrl } : lesson
            );

            await updateDoc(doc(db, "courseModules", id, "sections", sectionId), {
                lessons: updatedLessons
            });

            setSections(prev => prev.map(s => s.id === sectionId ? { ...s, lessons: updatedLessons } : s));
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setUploadingKey(null);
        }
    };

    useEffect(() => {
    const fetchWhatsappLink = async () => {
        try {
            const snap = await getDoc(doc(db, "courseModules", id));
            if (snap.exists() && snap.data().whatsappGroupLink) {
                setWhatsappLink(snap.data().whatsappGroupLink);
            }
        } catch (error) {
            console.error("Error fetching WhatsApp link:", error);
        }
    };
    fetchWhatsappLink();
    }, [id]);

    const handleSaveWhatsapp = async () => {
    setSavingWhatsapp(true);
    try {
        await setDoc(doc(db, "courseModules", id), { whatsappGroupLink: whatsappLink }, { merge: true });
    } catch (error) {
        console.error("Error saving WhatsApp link:", error);
    } finally {
        setSavingWhatsapp(false);
    }
    };

    if (courseLoading) return <p>Loading course...</p>;
    if (!course) return <h2>Course not found</h2>;

    return (
        <div className="admin-course-modules">
            <h1>{course.title} — Manage Sections & Videos</h1>

            <div className="whatsapp-link-section">
                <label>WhatsApp Group Link</label>
                <div className="whatsapp-link-row">
                <input
                type="text"
                placeholder="https://chat.whatsapp.com/..."
                value={whatsappLink}
                onChange={(e) => setWhatsappLink(e.target.value)}
                />
                <button onClick={handleSaveWhatsapp} disabled={savingWhatsapp}>
                    {savingWhatsapp ? "Saving..." : "Save Link"}
                </button>
                </div>
            </div>

            {loading ? (
                <p>Loading modules...</p>
            ) : (
                <>
                    {sections.map(section => (
                        <div className="section-block" key={section.id}>
                            <h3>{section.title}</h3>
                            <button className="delete-section-btn" onClick={() => handleDeleteSection(section.id, section.title)}>
                                Delete Section
                            </button>
                            {section.lessons.map(lesson => (
                                <div className="lesson-row" key={lesson.id}>
                                    <input
                                    type="text"
                                    className="lesson-name-input"
                                    value={lesson.title}
                                    onChange={(e) => handleLessonTitleChange(section.id, lesson.id, e.target.value)}
                                    />

                                    <div className="upload-group">
                                        <label className="upload-label">Video ID:</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 1234567890"
                                            value={lesson.bunnyVideoId  || ""}
                                            onChange={(e) => handleBunnyVideoIdChange(section.id, lesson.id, e.target.value)}
                                        />
                                    </div>

                                    <div className="upload-group">
                                        <label className="upload-label">Exercise/PDF:</label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileUpload(section.id, lesson.id, section.examPeriod, e.target.files[0])}
                                        />
                                        {uploadingKey === `${section.id}_${lesson.id}` && <span>Uploading...</span>}
                                    </div>

                                    <button className="delete-lesson-btn" onClick={() => handleDeleteLesson(section.id, lesson.id, lesson.title)}>
                                        Delete Lesson
                                    </button>
                                </div>
                            ))}

                            <div className="add-lesson-row">
                                <input
                                    type="text"
                                    placeholder="New lesson title"
                                    value={newLessonTitle[section.id] || ""}
                                    onChange={(e) => setNewLessonTitle(prev => ({ ...prev, [section.id]: e.target.value }))}
                                />
                                <button type="button" onClick={() => handleAddLesson(section.id)}>+ Add Lesson</button>
                            </div>

                            <button
                                className="save-section-btn"
                                onClick={() => handleSave(section.id)}
                                disabled={savingLessonKey === section.id}
                            >
                                {savingLessonKey === section.id ? "Saving..." : "Save Section"}
                            </button>
                        </div>
                    ))}

                    {showNewSectionForm ? (
                        <form onSubmit={handleAddSection} className="new-section-form">
                            <h3>Add New Section</h3>
                            <div className="form-input">
                                <label>Section Title</label>
                                <input type="text" required value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
                            </div>
                            <div className="form-row">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={newSectionFree} onChange={(e) => setNewSectionFree(e.target.checked)} />
                                    Free Preview
                                </label>
                                <div className="form-input">
                                    <label>Exam Period</label>
                                    <select value={newSectionExamPeriod} onChange={(e) => setNewSectionExamPeriod(e.target.value)}>
                                        <option value="partial">Partial</option>
                                        <option value="final">Final</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowNewSectionForm(false)}>Cancel</button>
                                <button type="submit">Create Section</button>
                            </div>
                        </form>
                    ) : (
                        <button className="add-section-btn" onClick={() => setShowNewSectionForm(true)}>
                            + Add New Section
                        </button>
                    )}
                </>
            )}
        </div>
    )
}

export default AdminCourseModules;
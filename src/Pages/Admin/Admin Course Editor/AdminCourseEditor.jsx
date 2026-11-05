import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../../firebaseConfig";
import majors from "../../../data/Majorsdata";
import universities from "../../../data/Universitiesdata";
import "./AdminCourseEditor.css";

const emptyForm = {
    title: "",
    subtitle: "",
    tagline: "",
    major: "",
    universityPath: "",
    language: "english",
    groupId: "",
    instructor: "",
    titleOfInstructor: "Instructor",
    pricePartial: "",
    priceFinal: "",
    priceFull: "",
    image: "",
    titleOfCourseDescription: "Course Description",
    CourseDescription: "",
    titleOfWhoIsThisCourseFor: "Who is this course for?",
    whoIsThisCourseFor: "",
    titleOfWhatYouLearn: "What you'll learn",
    learningPoints: "",
};

function AdminCourseEditor(){
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const storage = getStorage();

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!isEditMode) return;

        const fetchCourse = async () => {
            try {
                const snap = await getDoc(doc(db, "courses", id));
                if (snap.exists()) {
                    const data = snap.data();
                    setForm({
                        ...emptyForm,
                        ...data,
                        pricePartial: data.pricePartial ?? "",
                        priceFinal: data.priceFinal ?? "",
                        priceFull: data.priceFull ?? "",
                        whoIsThisCourseFor: (data.whoIsThisCourseFor || []).join("\n"),
                        learningPoints: (data.learningPoints || []).join("\n"),
                    });
                } else {
                    setErrorMessage("Course not found.");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                setErrorMessage("Failed to load course.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, isEditMode]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploadingImage(true);
        try {
            const filePath = `courseImages/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, filePath);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            handleChange("image", downloadUrl);
        } catch (error) {
            console.error("Error uploading image:", error);
            setErrorMessage("Failed to upload image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrorMessage("");

        const payload = {
            ...form,
            pricePartial: Number(form.pricePartial) || 0,
            priceFinal: Number(form.priceFinal) || 0,
            priceFull: Number(form.priceFull) || 0,
            whoIsThisCourseFor: form.whoIsThisCourseFor.split("\n").map(s => s.trim()).filter(Boolean),
            learningPoints: form.learningPoints.split("\n").map(s => s.trim()).filter(Boolean),
        };

        try {
            if (isEditMode) {
                await updateDoc(doc(db, "courses", id), payload);
                navigate("/admin/courses");
            } else {
                const newDocRef = await addDoc(collection(db, "courses"), {
                    ...payload,
                    createdAt: serverTimestamp(),
                });
                navigate(`/admin/courses/${newDocRef.id}`);
            }
        } catch (error) {
            console.error("Error saving course:", error);
            setErrorMessage("Failed to save course. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading course...</p>;

    return (
        <div className="admin-course-editor">
            <h1>{isEditMode ? "Edit Course" : "Add New Course"}</h1>

            <form onSubmit={handleSubmit} className="course-form">
                <div className="form-input">
                    <label>Course Card Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                    {uploadingImage && <span className="upload-status">Uploading...</span>}
                </div>

                <div className="form-row">
                    <div className="form-input-editor">
                        <label>Title</label>
                        <input type="text" required value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
                    </div>
                    <div className="form-input-editor">
                        <label>Subtitle</label>
                        <input type="text" value={form.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} />
                    </div>
                </div>

                <div className="form-input-editor">
                    <label>Tagline</label>
                    <input type="text" value={form.tagline} onChange={(e) => handleChange("tagline", e.target.value)} />
                </div>

                <div className="form-row">
                    <div className="form-input-editor">
                        <label>Major</label>
                        <select required value={form.major} onChange={(e) => handleChange("major", e.target.value)}>
                            <option value="">-- Select --</option>
                            {majors.map(m => (
                                <option key={m.path} value={m.path}>{m.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-input-editor">
                        <label>University</label>
                        <select required value={form.universityPath} onChange={(e) => handleChange("universityPath", e.target.value)}>
                            <option value="">-- Select --</option>
                            {universities.map(u => (
                                <option key={u.path} value={u.path}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-input-editor">
                        <label>Language</label>
                        <select value={form.language} onChange={(e) => handleChange("language", e.target.value)}>
                            <option value="english">English</option>
                            <option value="french">French</option>
                        </select>
                    </div>
                    <div className="form-input-editor">
                        <label>Group ID <span className="hint">(links EN/FR versions of the same course)</span></label>
                        <input type="text" placeholder="e.g. accounting-1" value={form.groupId} onChange={(e) => handleChange("groupId", e.target.value)} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-input-editor">
                        <label>{form.titleOfInstructor || "Instructor"} Name</label>
                        <input type="text" required value={form.instructor} onChange={(e) => handleChange("instructor", e.target.value)} />
                    </div>
                </div>

                <div className="form-row form-row-3">
                    <div className="form-input-editor">
                        <label>Partial Price ($)</label>
                        <input type="number" required value={form.pricePartial} onChange={(e) => handleChange("pricePartial", e.target.value)} />
                    </div>
                    <div className="form-input-editor">
                        <label>Final Price ($)</label>
                        <input type="number" required value={form.priceFinal} onChange={(e) => handleChange("priceFinal", e.target.value)} />
                    </div>
                    <div className="form-input-editor">
                        <label>Full Price ($)</label>
                        <input type="number" required value={form.priceFull} onChange={(e) => handleChange("priceFull", e.target.value)} />
                    </div>
                </div>

                <div className="form-input-editor">
                    <label>Course Description</label>
                    <textarea rows="4" required value={form.CourseDescription} onChange={(e) => handleChange("CourseDescription", e.target.value)} />
                </div>

                <div className="form-input-editor">
                    <label>Who is this course for? <span className="hint">(one per line)</span></label>
                    <textarea rows="4" value={form.whoIsThisCourseFor} onChange={(e) => handleChange("whoIsThisCourseFor", e.target.value)} />
                </div>

                <div className="form-input-editor">
                    <label>What you'll learn <span className="hint">(one per line)</span></label>
                    <textarea rows="5" value={form.learningPoints} onChange={(e) => handleChange("learningPoints", e.target.value)} />
                </div>

                {errorMessage && <p className="error">{errorMessage}</p>}

                <button type="submit" className="save-course-btn" disabled={saving}>
                    {saving ? "Saving..." : isEditMode ? "Save Changes" : "Create Course & Add Sections"}
                </button>
            </form>
        </div>
    )
}

export default AdminCourseEditor;
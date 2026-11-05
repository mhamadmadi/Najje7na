import "./LessonPlayer.css";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
import {collection, getDocs, query, orderBy, doc, getDoc} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";

const BUNNY_LIBRARY_ID = "795731";

function LessonPlayer() {
    const { id, sectionId, lessonId } = useParams();
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [sections, setSections] = useState([]);
    const [accessLevel, setAccessLevel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openModuleId, setOpenModuleId] = useState(sectionId);
    const [watermarkPosition, setWatermarkPosition] = useState("left");

    const iframeRef = useRef(null);

    const videoContainerRef = useRef(null);

    const handleFullscreen = async () => {
    const container = videoContainerRef.current;

    if (!container) return;
    
    try {
        if (!document.fullscreenElement) {
            await container.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    } catch (error) {
        console.error("Fullscreen error:", error);
    }
};

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            try {
                const courseSnap = await getDoc(doc(db, "courses", id));

                setCourse(courseSnap.exists() ? { id: courseSnap.id, ...courseSnap.data() } : null);

                const sectionsRef = collection(db, "courseModules", id, "sections");

                const q = query(sectionsRef, orderBy("order"));
                const snapshot = await getDocs(q);

                setSections(snapshot.docs.map(d => ({id: d.id, ...d.data()})));

                if (currentUser) {
                    const enrollmentSnap = await getDoc(doc(db, "enrollments", `${currentUser.uid}_${id}`));

                    setAccessLevel(enrollmentSnap.exists() ? enrollmentSnap.data().accessLevel : null);
                }
            } catch (error) {
                console.error("Error loading lesson player:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id, currentUser]);

    useEffect(() => {
        const interval = setInterval(() => {
            setWatermarkPosition(previous => previous === "left" ? "right" : "left");
        }, 15000);

        return () => clearInterval(interval);
    }, []);

useEffect(() => {
    const checkFullscreen = () => {
        const w = document.querySelector(".student-watermark");

        if (!document.fullscreenElement || !w) return;

        const rect = w.getBoundingClientRect();
        const style = getComputedStyle(w);

        console.log("WATERMARK DIAGNOSTIC:", {
            fullscreenElement: document.fullscreenElement.className,
            watermarkParent: w.parentElement?.className,
            opacity: style.opacity,
            visibility: style.visibility,
            display: style.display,
            position: style.position,
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        });
    };

    document.addEventListener("fullscreenchange", checkFullscreen);

    const interval = setInterval(checkFullscreen, 2000);

    return () => {
        document.removeEventListener("fullscreenchange", checkFullscreen);
        clearInterval(interval);
    };
}, []);

    const isModuleUnlocked = (module) => {
        if (module.free) return true;
        if (accessLevel === "full") return true;

        if (accessLevel === "partial" && module.examPeriod === "partial") return true;

        if (accessLevel === "final" && module.examPeriod === "final") return true;

        return false;
    };

    const flatLessons = useMemo(() => {
        const list = [];

        sections.forEach((section) => {
            const unlocked = isModuleUnlocked(section);

            section.lessons.forEach((lesson) => {
                list.push({section, lesson, unlocked});
            });
        });

        return list;
    }, [sections, accessLevel]);

    const currentSection = sections.find(s => s.id === sectionId);

    const currentLesson = currentSection?.lessons.find(l => String(l.id) === String(lessonId));

    const currentUnlocked = currentSection ? isModuleUnlocked(currentSection) : false;

    const currentIndex = flatLessons.findIndex(item => item.section.id === sectionId && String(item.lesson.id) === String(lessonId));

    const goTo = (item) => {
        if (!item) return;

        navigate(`/course/${id}/lesson/${item.section.id}/${item.lesson.id}`);

        setOpenModuleId(item.section.id);
    };

    const nextItem = useMemo(() => {
        for (let i = currentIndex + 1; i < flatLessons.length; i++) {
            const item = flatLessons[i];

            if (item.unlocked && (item.lesson.bunnyVideoId || item.lesson.documentUrl)) {
                return item;
            }
        }

        return null;
    }, [currentIndex, flatLessons]);

    const prevItem = useMemo(() => {
        for (let i = currentIndex - 1; i >= 0; i--) {
            const item = flatLessons[i];

            if (item.unlocked && (item.lesson.bunnyVideoId || item.lesson.documentUrl)) {
                return item;
            }
        }

        return null;
    }, [currentIndex, flatLessons]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tag = e.target?.tagName?.toLowerCase();

            if (tag === "input" || tag === "textarea") return;

            if (e.key === "ArrowRight" && nextItem) {
                goTo(nextItem);
            }

            if (e.key === "ArrowLeft" && prevItem) {
                goTo(prevItem);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [nextItem, prevItem]);

    if (loading) {
        return <p className="lesson-loading">Loading...</p>;
    }

    if (!course || !currentSection || !currentLesson) {
        return <h2>Lesson not found</h2>;
    }

    if (!currentUnlocked) {
        return <h2>You don't have access to this lesson.</h2>;
    }

    const studentName = userData?.name || "Student";
    const studentId = userData?.studentId || "";

    return (
        <div className="lesson-player-page">

            <Link to={`/course/${id}`} className="back-to-course">
                <i className="bi bi-arrow-left"></i>
                Back to {course.title}
            </Link>

            <div className="lesson-layout">
                <div className="lesson-main">
                    <div className="video-stage" ref={videoContainerRef}>
                        <div className="video-wrapper" id="lesson-video-container">
                            {currentLesson.bunnyVideoId ? (
                                <>
                                <iframe
                                key={`${sectionId}-${lessonId}`}
                                ref={iframeRef}
                                src={`https://player.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${currentLesson.bunnyVideoId}`}
                                title={currentLesson.title}
                                loading="eager"
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                referrerPolicy="strict-origin-when-cross-origin"
                                />

                                <button type="button" className="custom-fullscreen-btn" onClick={handleFullscreen} title="Toggle fullscreen">
                                    <i className="bi bi-fullscreen"></i>
                                </button>
                                </>
                                ) : currentLesson.documentUrl ? (
                                <iframe src={currentLesson.documentUrl} title={currentLesson.title} className="document-preview"/>
                                ) : (
                                <p>No video available for this lesson.</p>
                                )}
                        </div>

                                {currentUser && currentLesson.bunnyVideoId && (
                                <div className={`student-watermark watermark-${watermarkPosition}`}>
                                    <span>{studentName}</span>
                                    {studentId && <span>{studentId}</span>}
                                </div>
                                )}

                    </div>
            
                    <div className="lesson-nav">
                        <button onClick={() => goTo(prevItem)} disabled={!prevItem}>
                            <i className="bi bi-arrow-left"></i> Previous
                        </button>

                        <h3>{currentLesson.title}</h3>

                        <button onClick={() => goTo(nextItem)} disabled={!nextItem}>
                            Next <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>

                    {currentLesson.documentUrl && (
                        <a href={currentLesson.documentUrl} target="_blank" rel="noreferrer" className="lesson-doc-link">
                            <i className="bi bi-file-earmark-arrow-down"></i>
                            Download Exercise/Document
                        </a>
                    )}

                </div>

                <aside className="lesson-sidebar">
                    <div className="sidebar-title">Course Content</div>

                    {sections.map((section) => {
                        const unlocked = isModuleUnlocked(section);
                        const isOpen = openModuleId === section.id;

                        return (
                            <div key={section.id} className="sidebar-module">
                                <div className="sidebar-module-header" onClick={() => setOpenModuleId( isOpen ? null : section.id)}>
                                    <span>{section.title}</span>

                                    {section.free && (<span className="free-badge-small">Free</span>)}

                                    <i className={`bi ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                                </div>

                                {isOpen && (
                                    <div className="sidebar-lesson-list">
                                        {section.lessons.map((lesson) => {
                                            const isCurrent = section.id === sectionId && String(lesson.id) === String(lessonId);

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className={`sidebar-lesson ${unlocked ? "clickable" : "locked"} ${isCurrent ? "active" : ""}`}
                                                    onClick={() => unlocked && (lesson.bunnyVideoId || lesson.documentUrl) && goTo({ section, lesson })}
                                                >
                                                    <i className={!unlocked ? "bi bi-lock" : lesson.bunnyVideoId ? "bi bi-play-circle" : "bi bi-file-earmark-text"}></i>
                                                    
                                                    <span>{lesson.title}</span>
                                                    
                                                    {isCurrent && (<span className="playing-label">Playing</span>)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </aside>
            </div>
        </div>
    );
}

export default LessonPlayer;

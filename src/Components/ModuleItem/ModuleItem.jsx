import "./ModuleItem.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ModuleItem({ modules = [], accessLevel, courseId }) {
    const [openModuleId, setOpenModuleId] = useState(
        modules.length > 0 ? modules[0].id : null
    );

    const navigate = useNavigate();

    const isModuleUnlocked = (module) => {
        if (module.free) {
            return true;
        }

        if (accessLevel === "full") {
            return true;
        }

        if (accessLevel === "partial" && module.examPeriod === "partial") {
            return true;
        }

        if (accessLevel === "final" && module.examPeriod === "final") {
            return true;
        }

        return false;
    };

    const toggleModule = (moduleId) => {
        setOpenModuleId((currentId) =>
            currentId === moduleId ? null : moduleId
        );
    };

    const handleLessonClick = (module, lesson) => {
        const unlocked = isModuleUnlocked(module);

        if (!unlocked) {
            return;
        }

        if (lesson.bunnyVideoId) {
            navigate(`/course/${courseId}/lesson/${module.id}/${lesson.id}`);
            return;
        }

        if (lesson.documentUrl) {
            window.open(lesson.documentUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <section className="modules">
            <div className="module-title">
                <h1>Course Content</h1>
            </div>

            <div className="modules-container">
                {modules.map((module, moduleIndex) => {
                    const unlocked = isModuleUnlocked(module);
                    const isOpen = openModuleId === module.id;

                    return (
                        <div className="module-container" key={module.id}>
                            <div
                                className="module"
                                onClick={() => toggleModule(module.id)}
                            >
                                <div className="module-left">
                                    <h3>
                                        Module {moduleIndex + 1}: {module.title}
                                    </h3>

                                    <p>
                                        {module.lessons?.length || 0} lessons
                                        {module.free && (
                                            <span className="free-badge">
                                                Free Preview
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="module-right">
                                    {!unlocked && (
                                        <i className="bi bi-lock-fill module-lock"></i>
                                    )}

                                    <i
                                        className={`bi ${
                                            isOpen
                                                ? "bi-chevron-up"
                                                : "bi-chevron-down"
                                        }`}
                                    ></i>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="lesson-list">
                                    {module.lessons?.map(
                                        (lesson, lessonIndex) => {
                                            const hasVideo = Boolean(
                                                lesson.bunnyVideoId
                                            );

                                            const hasDocument = Boolean(
                                                lesson.documentUrl
                                            );

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className={`lesson-item ${
                                                        unlocked
                                                            ? "clickable"
                                                            : "locked"
                                                    }`}
                                                    onClick={() =>
                                                        handleLessonClick(
                                                            module,
                                                            lesson
                                                        )
                                                    }
                                                >
                                                    <div className="lesson-left">
                                                        <span className="lesson-icon">
                                                            {!unlocked ? (
                                                                <i className="bi bi-lock-fill"></i>
                                                            ) : hasVideo ? (
                                                                <i className="bi bi-play-circle"></i>
                                                            ) : (
                                                                <i className="bi bi-file-earmark-text"></i>
                                                            )}
                                                        </span>

                                                        <span className="lesson-title">
                                                            {lessonIndex + 1}.{" "}
                                                            {lesson.title}
                                                        </span>
                                                    </div>

                                                    <div className="lesson-right">
                                                        {hasVideo && unlocked && (
                                                            <i className="bi bi-play-fill lesson-play-arrow"></i>
                                                        )}

                                                        {hasDocument && unlocked && (
                                                            <a
                                                                href={lesson.documentUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="lesson-download"
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="Open document"
                                                            >
                                                                <i className="bi bi-file-earmark-arrow-down"></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default ModuleItem;

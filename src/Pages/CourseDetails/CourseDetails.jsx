import "./CourseDetails.css";
import ModuleItem from "../../Components/ModuleItem/ModuleItem";
import universities from "../../data/Universitiesdata";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";

function CourseDetails(){
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [accessLevel, setAccessLevel] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setCourseLoading(true);
      try {
        const courseSnap = await getDoc(doc(db, "courses", id));
        if (courseSnap.exists()) {
          setCourse({ id: courseSnap.id, ...courseSnap.data() });
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      } finally {
        setCourseLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (!course) return;

    const fetchData = async () => {
      setModulesLoading(true);
      try {
        const sectionsRef = collection(db, "courseModules", id, "sections");
        const q = query(sectionsRef, orderBy("order"));
        const snapshot = await getDocs(q);
        const fetchedModules = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setModules(fetchedModules);
        const courseModulesDoc = await getDoc(doc(db, "courseModules", id));

        if (courseModulesDoc.exists() && courseModulesDoc.data().whatsappGroupLink) {
        setWhatsappLink(courseModulesDoc.data().whatsappGroupLink);
        }

        if (currentUser) {
          const enrollmentId = `${currentUser.uid}_${id}`;
          const enrollmentSnap = await getDoc(doc(db, "enrollments", enrollmentId));
          setAccessLevel(enrollmentSnap.exists() ? enrollmentSnap.data().accessLevel : null);
        } else {
          setAccessLevel(null);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setWhatsappLink(null);
      } finally {
        setModulesLoading(false);
      }
    };

    fetchData();
  }, [course, currentUser, id]);

  const handleEnrollClick = () => {
    if (!currentUser) {
        navigate("/Login", { state: { from: `/course/${id}` } });
        return;
    }
    navigate("/Contact", { state: { courseTitle: title } });
  };

  if (courseLoading) return <p className="no-modules">Loading course...</p>;
  if (!course) return <h1>Course not found</h1>;

  const {
    title, subtitle, tagline, titleOfInstructor, instructor,
    pricePartial, priceFinal, priceFull, titleOfCourseDescription, CourseDescription,
    titleOfWhatYouLearn, learningPoints, titleOfWhoIsThisCourseFor,
    whoIsThisCourseFor, university,
  } = course;

  const uniData = universities.find(u => u.name === course.university || u.path === course.universityPath);

  return(
        <>
    <section className="description-section">
      <div className="description-container">
        <div className="description-title">
          <h1>{title}</h1>
        </div>
        <div className="description-content">
          <h4 className="course-description">{titleOfCourseDescription}</h4>
          <p>{CourseDescription}</p>
          <h4 className="this-course-for">{titleOfWhoIsThisCourseFor}</h4>
          <ul>
            {whoIsThisCourseFor.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
          <h4 className="what-you-learn">{titleOfWhatYouLearn}</h4>
          <ul>
            {learningPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="course-hero">
      <div className="course-hero-container">
        <div className="course-hero-university">
          <img src={uniData?.image} alt={university} />
          <h4>{university}</h4>
        </div>
        <div className="course-hero-content">
          <strong>{subtitle}</strong>
          <p>{tagline}</p>
          <strong className="instructor">{titleOfInstructor}: {instructor}</strong>
        </div>
        <div className="course__pricing">
          <div className="price-box">
            <span className="price-label">Partial</span>
            <span className="price-value">${pricePartial}</span>
          </div>
          <div className="price-box">
            <span className="price-label">Final</span>
            <span className="price-value">${priceFinal}</span>
          </div>
          <div className="price-box full">
            <span className="price-label">Full Access</span>
            <span className="price-value">${priceFull}</span>
          </div>
        </div>
        <button className="course__btn" onClick={handleEnrollClick}>Enroll Now</button>
        {whatsappLink && (
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="whatsapp-group-link">
          <i className="bi bi-whatsapp"></i> Join WhatsApp Group
        </a>
        )}
      </div>
    </section>

    {modulesLoading ? (
        <p className="no-modules">Loading modules...</p>
    ) : modules.length > 0 ? (
        <ModuleItem modules={modules} accessLevel={accessLevel} courseId={id} />
    ) : (
        <p className="no-modules">Modules coming soon for this course.</p>
    )}
        </>
    )
}

export default CourseDetails;
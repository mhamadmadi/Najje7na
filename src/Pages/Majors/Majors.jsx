import { useParams, Link } from "react-router-dom";
import universities from "../../data/Universitiesdata";
import majors from "../../data/Majorsdata";
import "./Majors.css"

function Majors(){

    const { id } = useParams();

    const university = universities.find(
        (uni) => uni.path.toLowerCase() === id.toLowerCase()
    );

    if(!university){
        return <h2>University not found</h2>
    }

    return(
        <div>
            {/* your majors section here */}
            <section className="major-section">
                <div className="major-title">
                    <h2>Available Majors</h2>
                </div>
                <div className="major-container">
                    {majors.map((major) => (
                        <div className="major-card" key={major.path}>
                            <i className={`bi ${major.icon}`}></i>
                            <h3>{major.name}</h3>
                            <Link to={`/courses/${major.path}`} className="courses-link">
                                See Courses
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Majors;
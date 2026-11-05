import "./Universities.css"
import { Link } from "react-router-dom";
import universities from "../../data/Universitiesdata";

function Universities(){
    return(
       <>
    {/* Universities Section */}
    <section className="university-section">
        <div className="university-title">
            <h1>OUR UNIVERSITIES</h1>
        </div>
        <div className="university-card">
            {universities.map((uni) => (
                <div className="university-item" key={uni.path}>
                <img src={uni.image} alt={uni.name}/>
                <h2>{uni.name}</h2>
                {uni.available ? (
                <Link to={`/university/${uni.path}`}>See Courses</Link>
                ) : (<span className="coming-soon">Coming Soon</span>) }
            </div>
            ))}
        </div>
    </section>
    {/* End Universities Section */}
       </>
    )
}

export default Universities;
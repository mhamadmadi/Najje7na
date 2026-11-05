import { Link } from "react-router-dom";

function CourseCard({id, title, image}){
    return(
        <>
            <div className="card-item">
                <img src={image} alt={title}/>
                <h3>{title}</h3>
                <Link to={`/course/${id}`} className="card-btn">Start learning</Link> 
            </div>
        </>
    )
}

export default CourseCard;
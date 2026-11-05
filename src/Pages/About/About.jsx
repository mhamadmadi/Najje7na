import "./About.css"

function About(){
    return(
        <>
        {/* Hero Section */}
        <section className="hero-section">
            <div className="hero-title">
                <h2>LEARNING HAS A BETTER WAY</h2>
                <p>From one student helping others to an educational platform built for students.</p>
            </div>
            <div className="hero-content">
                <p>NAJJE7NA was born from a simple idea: learning becomes easier when you truly understand what you are studying.</p>
                <p>The journey started years before NAJJE7NA had a name.</p>
                <p>When I began my university journey in Accounting and Auditing at the Lebanese University, I quickly discovered a strong passion for accounting — but also for something I did not expect: teaching.</p>
                <p>I started by helping friends and classmates with the subjects I was comfortable with. I would explain concepts, solve exercises with them, and find different ways to make difficult topics easier to understand.</p>
                <p>What started as helping a few friends gradually became a real teaching journey.</p>
                <p>As my experience grew, more students started reaching out to me for help. I was also given the opportunity to conduct free educational sessions and revision courses for students through the Student Council.</p>
                <p>With every session, I learned more about teaching — not only about what to explain, but about how students actually learn.</p>
                <p>Over the years, teaching became an important part of my journey. I continued developing my experience while completing my Master's degree in Accounting and Auditing, reaching nearly five years of experience in teaching accounting-related subjects.</p>
            </div>
        </section>
        {/* End Hero Section */}

        {/* Why Najjehne Section */}
        <section className="najjehne-section">
            <div className="najjehne-title">
                <h2>WHY NAJJE7NA?</h2>
                <p>Because You Shouldn't Have to Study Alone.</p>
            </div>
            <div className="najjehne-content">
                <p>Sometimes, the problem is not that the subject is difficult.</p>
                <p>Sometimes, you just need someone to explain it differently.</p>
                <p>NAJJE7NA is built to give students that extra support — through structured lessons, practical examples, solved exercises, exam preparation, and educational resources designed to make studying more manageable.</p>
                <p>Whether you are trying to understand your first accounting chapter, preparing for an important exam, or looking for additional practice, NAJJE7NA is here to help you take the next step.</p>
            </div>
        </section>
        {/* End Why Najjehne Section */}

        {/* Founder Section */}
        <section className="founder-section">
            <div className="founder-title">
                <h2>MEET THE FOUNDER</h2>
                <p>The Person Behind NAJJE7NA</p>
            </div>
            <div className="founder-content">
                <div className="founder-introduce">
                    <h4>Ali Hussein Issa - Master's Degree in Accounting & Auditing</h4>
                    <p>My journey with education started as a student. While studying Accounting and Auditing at the Lebanese University, I began helping classmates understand subjects, solve exercises, and prepare for exams.</p>
                    <p>What began as a simple way of helping others gradually became a passion for teaching.</p>
                    <p>Over nearly five years, I have worked with students across different accounting subjects, conducted revision sessions, supported students with exam preparation, and had the opportunity to teach accounting-related courses at the Islamic University of Lebanon.</p>
                    <p>Alongside teaching, I continued my academic journey and completed my Master's degree in Accounting and Auditing.</p>
                    <p>NAJJE7NA brings these two sides of my journey together:</p>
                    <p>the student who understands the challenges of learning, and the teacher who understands the importance of explaining them clearly.</p>
                    <p>I created NAJJE7NA because I wanted to build the kind of learning experience I would have wanted as a student — organized, practical, clear, and focused on real understanding. And this is only the beginning</p>
                </div>
                <div className="founder-image">
                    <img src="/images/Ali Issa - Founder.jpeg" alt="Ali Issa Profile" />
                </div>
            </div>
        </section>
        {/* End Founder Section */}
        </>
    )
}

export default About;
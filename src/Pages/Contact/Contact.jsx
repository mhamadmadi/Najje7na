import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Contact.css"

function Contact(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [course, setCourse] = useState("")
    const [accessLevel, setAccessLevel] = useState("partial")
    const [paymentMethod, setPaymentMethod] = useState("whish")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleContact = async (e) => {
        e.preventDefault()
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try{
            await addDoc(collection(db, "contactMessages"), {
            name,
            email,
            phone,
            course,
            accessLevel,
            paymentMethod,
            message,
            createdAt: serverTimestamp(),
        });
            setSuccessMessage("Message sent successfully");
            setName("");
            setEmail("");
            setPhone("");
            setCourse("");
            setAccessLevel("partial");
            setPaymentMethod("whish");
            setMessage("");
        } catch(error){
            setErrorMessage("Something went wrong. Please try again.");
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
        <div className="contact-title">
            <h2>Enroll Now</h2>
            <p className="subtitle">
                Fill in your details below and we'll reach out to confirm your enrollment.
            </p>
        </div>
            <div className="contact-form">
                <form onSubmit={handleContact}>
                    <div className="form-input">
                        <label htmlFor="name">Full Name</label>
                        <br />
                        <input type="text" name="name" id="name" placeholder="Your full Name" required value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="email">Email</label>
                        <br />
                        <input type="email" name="email" id="email" placeholder="Your email address" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="phone">Phone Number</label>
                        <br />
                        <input type="tel" name="phone" id="phone" placeholder="Your phone number" required value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="course">Course Name</label>
                        <br />
                        <input type="text" name="course" id="course" placeholder="Course Name" required value={course} onChange={(e) => setCourse(e.target.value)}/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="coursetype">Choose course type</label>
                        <br />
                        <select id="coursetype" name="coursetype" value={accessLevel} required onChange={(e) => setAccessLevel(e.target.value)}>
                            <option value="partial">Partial</option>
                            <option value="final">Final</option>
                            <option value="full">Full</option>
                        </select>
                    </div>
                    <div className="form-input">
                        <label htmlFor="payment">Choose payment type</label>
                        <br />
                        <select id="payment" name="payment" value={paymentMethod} required onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="whish">Whish</option>
                            <option value="omt">OMT</option>
                        </select>
                    </div>

                    {successMessage && <p className="success">{successMessage}</p>}
                    {errorMessage && <p className="error">{errorMessage}</p>}

                    <button type="submit" className="contact-submit" disabled={loading}>{loading ? "Sending Message..." : "Send Message"}</button>
                </form>
            </div>
        </>
    )
}
export default Contact;
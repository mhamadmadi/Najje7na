import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import "./Signup.css"

function SignUpForm(){
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        setLoading(true);

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                phone: phone,
                email: email,
                role: "student",
                createdAt: serverTimestamp(),
            });
            await signOut(auth);

            setSuccessMessage("Account created successfully");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
        }catch(error){
            if (error.code === "auth/email-already-in-use") {
                setErrorMessage("You already have an account. Please login.");
            }else if (error.code === "auth/weak-password"){
                setErrorMessage("Password should be at least 8 characters");
            }else if (error.code === "auth/invalid-email"){
                setErrorMessage("Please enter a valid email address");
            }else if (error.code === "auth/network-request-failed"){
                setErrorMessage("Network error. Please check your internet connection");
            }else{
                setErrorMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return(
    <div className="signup-page">
    <form className="form-container" onSubmit={handleSignup}>

        <div className="logo-image">
            <img src="/images/Najje7na logo.jpeg" alt="logo"/> 
        </div>

        <div className="form-title">
            <h2>Join Our Community</h2>
            <p className="subtitle">Create your account and start learning today</p>
        </div>

        <div className="form-input">
            <label htmlFor="name">Full Name</label>
            <br />
            <input
            type="text"
            name="name"
            id="name"
            placeholder="Jane Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>

        <div className="form-input">
            <label htmlFor="phone">Phone Number</label>
            <br />
            <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="+961 XX XXX XXX"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            />
        </div>

        <div className="form-input">
            <label htmlFor="email">Email</label>
            <br />
            <input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div className="form-input">
            <label htmlFor="password">Password</label>
            <br />
            <div className="password-field">
                <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} password-toggle`}
                    onClick={() => setShowPassword(!showPassword)}
                ></i>
            </div>
        </div>

        <div className="form-input">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <br />
            <div className="password-field">
                <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <i
                    className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} password-toggle`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></i>
            </div>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
        </button>

        <p>Already have an account? <Link to={"/Login"}>Sign in here</Link></p>
    </form>
    </div>
    );
} 
export default SignUpForm;
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Link } from "react-router-dom";

function LogInForm(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[showPassword, setShowPassword] = useState(false);
    const[errorMessage, setErrorMessage] = useState("");
    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }catch(error){
            if (error.code === "auth/invalid-credential") {
                    setErrorMessage("Invalid email or password");
                }else if(error.code === "auth/invalid-email"){
                    setErrorMessage("Please enter a valid email address");
                }else if(error.code === "auth/too-many-requests"){
                    setErrorMessage("Too many failed attempts. Please try again later.");
                }else if(error.code === "auth/network-request-failed"){
                    setErrorMessage("Network error. Please check your internet connection");
                }else{
                    setErrorMessage(error.message);
                }
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="login-page">
            <form className="form-container" onSubmit={handleLogin}>

            <div className="logo-image">
            <img src="/images/Najje7na logo.jpeg" alt="logo"/> 
            </div>

            <div className="form-title">
                <h2>Welcome Back!</h2>
                <p className="subtitle">Sign in to continue your learning journey</p>
            </div>

            <div className="form-input">
                <label htmlFor="email">Email</label>
                <br />
                <input
                type="email"
                name="email"
                id="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="form-input">
                <label htmlFor="password">Password</label>
                <br />
                <div className="password-field">
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} password-toggle`}
                    onClick={() => setShowPassword(!showPassword)}
                    ></i>
                </div>
            </div>
            
            {errorMessage && <p className="error">{errorMessage}</p>}

            <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Logging in..." : "Sign in"}
            </button>

            <p>Don't have an account? <Link to={"/Signup"}>Sign up here</Link></p>

            </form>
        </div>
    )
}
export default LogInForm;
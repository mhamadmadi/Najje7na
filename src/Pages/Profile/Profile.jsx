import "./Profile.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateEmail, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

function Profile(){
    const { currentUser, userData } = useAuth();

    const [name, setName] = useState(userData?.name || "");
    const [phone, setPhone] = useState(userData?.phone || "");
    const [email, setEmail] = useState(userData?.email || "");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (password && password !== confirmpassword) {
        setErrorMessage("Passwords do not match.");
        return;
        }
        setLoading(true);

        try{
            if (email !== currentUser.email) {
                await updateEmail(currentUser, email);
            }
            if (password) {
                await updatePassword(currentUser, password);
            }
            await updateDoc(doc(db, "users", currentUser.uid), { name, phone, email });

            setSuccessMessage("Profile updated successfully!");
            setPassword("");
        }catch(error){
            if (error.code === "auth/requires-recent-login") {
                setErrorMessage("This change requires you to log in again. Please logout and login, then retry.");
            }else if (error.code === "auth/weak-password"){
                setErrorMessage("Password should be at least 6 characters");
            }else if (error.code === "auth/invalid-email"){
                setErrorMessage("Please enter a valid email address");
            }else if (error.code === "auth/email-already-in-use"){
                setErrorMessage("That email is already in use by another account.");
            }else{
                setErrorMessage(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="profile-page">
            <h1>Profile Settings</h1>

            <div className="personal">
                <h3>Personal Information</h3>

                <div className="form-container" onClick={(e) => e.stopPropagation()}>

                    <form onSubmit={handleSave}>
                        <div className="form-input">
                            <label htmlFor="name">Full Name</label>
                            <br />
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-input">
                            <label htmlFor="phone">Phone Number</label>
                            <br />
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="form-input">
                            <label htmlFor="email">Email</label>
                            <br />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-input">
                            <label htmlFor="password">New Password</label>
                            <br />
                            <input
                                type="password"
                                id="password"
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-input">
                            <label htmlFor="confirmpassword">Confirm Password</label>
                            <br />
                            <input
                                type="password"
                                id="confirmpassword"
                                placeholder="xxxxxxxxxx"
                                value={confirmpassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}

                        <div className="modal-footer">
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
)}

export default Profile;
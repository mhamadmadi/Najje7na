import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth, db } from "../firebaseConfig";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            try {
                if (user) {
                    setCurrentUser(user);

                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        let profile = userDocSnap.data();

                        if (
                            profile.role === "student" &&
                            !profile.studentId
                        ) {
                            const functions = getFunctions();
                            const assignStudentId = httpsCallable(
                                functions,
                                "assignStudentId"
                            );

                            const result = await assignStudentId();

                            profile = {
                                ...profile,
                                studentId: result.data.studentId,
                            };
                        }

                        setUserData(profile);
                    } else {
                        setUserData(null);
                    }
                } else {
                    setCurrentUser(null);
                    setUserData(null);
                }
            } catch (error) {
                console.error("Authentication profile error:", error);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        role: userData?.role || null,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

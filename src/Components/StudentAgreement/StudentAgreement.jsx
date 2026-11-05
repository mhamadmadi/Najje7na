import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebaseConfig";
import "./StudentAgreement.css";

const AGREEMENT_VERSION = "1.0";

const AGREEMENT_SECTIONS = [
    {
        title: "1. Personal and Educational Use",
        content: "All courses, recorded lessons, educational materials, exercises, documents, and resources provided through Najje7na are intended exclusively for the personal educational use of the registered student."
    },
    {
        title: "2. Content Ownership and Intellectual Property",
        content: "All educational content and materials made available through Najje7na are owned by Najje7na or their respective rights holders and are protected under applicable intellectual property laws. Access to a course does not grant ownership, reproduction rights, or permission to commercially exploit its content."
    },
    {
        title: "3. Prohibited Use",
        content: "Students must not, without prior written authorization from Najje7na:",
        bullets: [
            "Copy, reproduce, capture, or extract educational content.",
            "Share, publish, distribute, upload, or transfer course materials to third parties.",
            "Sell, rent, sublicense, or commercially exploit any part of the platform's content.",
            "Share account credentials or allow unauthorized persons to use their account.",
            "Attempt to bypass platform security or access restrictions."
        ]
    },
    {
        title: "4. Account Responsibility",
        content: "Each account is personal to its registered student. Students are responsible for maintaining the confidentiality of their login credentials and for activities carried out through their accounts, subject to applicable law."
    },
    {
        title: "5. Monitoring and Security",
        content: "Najje7na may maintain relevant account activity records, access logs, and security records to protect its platform, educational content, and users, in accordance with its Privacy Policy and applicable laws."
    },
    {
        title: "6. Violations",
        content: "Unauthorized use, reproduction, distribution, or commercial exploitation of Najje7na content may result in:",
        bullets: [
            "Suspension or termination of account access.",
            "Cancellation of course access, subject to applicable law and contractual obligations.",
            "Preservation of relevant records and evidence.",
            "Appropriate legal action and claims for damages where legally justified."
        ]
    }
];

function StudentAgreement() {
    const { currentUser, userData, role, loading } = useAuth();

    const [showAgreement, setShowAgreement] = useState(false);
    const [checkingAgreement, setCheckingAgreement] = useState(true);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
    const checkAgreement = async () => {
        if (loading) return;

        // Visitors and admins do not need to accept.
        if (!currentUser || role !== "student") {
            setShowAgreement(false);
            setCheckingAgreement(false);
            return;
        }

        try {
            const studentRef = doc(db, "users", currentUser.uid);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const studentData = studentSnap.data();

                setShowAgreement(
                    studentData.agreementVersion !== AGREEMENT_VERSION
                );
            } else {
                setShowAgreement(true);
            }
        } catch (error) {
            console.error("Error checking student agreement:", error);
            setShowAgreement(true);
        } finally {
            setCheckingAgreement(false);
        }
    };

    checkAgreement();
}, [currentUser, role, loading]);

const handleAccept = async () => {
    if (!currentUser || role !== "student") return;

    setAccepting(true);

    try {
        const studentRef = doc(db, "users", currentUser.uid);

        await updateDoc(studentRef, {
            agreementVersion: AGREEMENT_VERSION,
            agreementAcceptedAt: serverTimestamp(),
        });

        setShowAgreement(false);

    } catch (error) {
        console.error("Error saving agreement acceptance:", error);
        alert("We couldn't save your acceptance. Please try again.");
    } finally {
        setAccepting(false);
    }
};
if (checkingAgreement || !showAgreement) {
    return null;
}

return (
    <div className="agreement-overlay">
        <div
            className="agreement-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agreement-title"
        >
            <div className="agreement-header">
                <h2 id="agreement-title">
                    Najje7na – Platform & Educational Content Agreement
                </h2>

                <p>
                    Effective Date: {new Date().toLocaleDateString()}
                </p>
            </div>

            <div className="agreement-body">
                <p>
                    Welcome to Najje7na. By accessing your account and using
                    our educational services, you acknowledge and agree to
                    the following conditions:
                </p>

                {AGREEMENT_SECTIONS.map((section, index) => (
                    <section key={index} className="agreement-section">
                        <h3>{section.title}</h3>

                        <p>{section.content}</p>

                        {section.bullets && (
                            <ul>
                                {section.bullets.map((bullet, bulletIndex) => (
                                    <li key={bulletIndex}>{bullet}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                <section className="agreement-section">
                    <h3>7. Acceptance and Agreement</h3>

                    <p>By selecting "I Agree & Continue", I confirm that:</p>

                    <ul>
                        <li>I have read and understood this Agreement.</li>
                        <li>I agree to comply with its conditions.</li>
                        <li>
                            I understand that my course access is granted
                            for personal educational use only.
                        </li>
                        <li>
                            I understand that violations may result in
                            account restrictions and appropriate legal action.
                        </li>
                    </ul>

                    <p>
                        This Agreement forms part of the conditions governing
                        my use of Najje7na.
                    </p>
                </section>

                <div className="agreement-student-info">
                    <p>
                        <strong>Student Name:</strong>{" "}
                        {userData?.name || "Student"}
                    </p>

                    <p>
                        <strong>Account Email:</strong>{" "}
                        {currentUser?.email || "Not available"}
                    </p>
                </div>
            </div>

            <div className="agreement-footer">
                <p>
                    Please read the entire agreement before continuing.
                </p>

                <button
                    type="button"
                    onClick={handleAccept}
                    disabled={accepting}
                >
                    {accepting ? "Saving..." : "I Agree & Continue"}
                </button>
            </div>
        </div>
    </div>
);
}


export default StudentAgreement;
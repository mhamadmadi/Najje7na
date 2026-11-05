import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute({ children }) {
    const { currentUser, role, loading } = useAuth();

    if (loading) return null;

    if (!currentUser || role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;
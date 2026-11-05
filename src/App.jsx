import { Routes, Route } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import AdminRoute from "./Components/AdminRoute/AdminRoute.jsx";
import AdminDashboard from "./Pages/Admin/Admin Dashboard/AdminDashboard.jsx";
import AdminEnrollments from "./Pages/Admin/Admin Enrollments/AdminEnrollments.jsx";
import AdminEnrollmentHistory from "./Pages/Admin/Admin Enrollment History/AdminEnrollmentHistory.jsx";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop.jsx";
import AdminUsers from "./Pages/Admin/Admin Users/AdminUsers.jsx";
import AdminMessages from "./Pages/Admin/Admin Messages/AdminMessages.jsx";
import AdminCourses from "./Pages/Admin/Admin Courses/AdminCourses.jsx";
import AdminCourseEditor from "./Pages/Admin/Admin Course Editor/AdminCourseEditor.jsx";
import AdminCourseModules from "./Pages/Admin/Admin Course Modules/AdminCourseModules.jsx";
import FeedbackManagement from "./Pages/Admin/Feedback Management/FeedbackManagement.jsx";
import './App.css';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="enrollment-history" element={<AdminEnrollmentHistory />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<AdminCourseEditor />} />
          <Route path="courses/:id/edit" element={<AdminCourseEditor />} />
          <Route path="courses/:id" element={<AdminCourseModules />} />
          <Route path="feedback" element={<FeedbackManagement />} />
        </Route>
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </>
  )
}

export default App;
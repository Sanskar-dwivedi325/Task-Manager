import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import ProjectList from './pages/ProjectList.jsx';
import Signup from './pages/Signup.jsx';
import TaskManagement from './pages/TaskManagement.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<TaskManagement />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

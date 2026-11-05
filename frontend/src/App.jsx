import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import People from './pages/People';
import Issue from './pages/Issue';
import MyBooks from './pages/MyBooks';
import Alerts from './pages/Alerts';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  return roles.includes(user.role) ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Protected><Layout /></Protected>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/my-books" element={<RoleRoute roles={['member']}><MyBooks /></RoleRoute>} />
            <Route path="/members" element={<RoleRoute roles={['staff', 'admin']}><People /></RoleRoute>} />
            <Route path="/issue" element={<RoleRoute roles={['staff', 'admin']}><Issue /></RoleRoute>} />
            <Route path="/alerts" element={<RoleRoute roles={['staff', 'admin']}><Alerts /></RoleRoute>} />
            <Route path="/staff" element={<RoleRoute roles={['admin']}><People staffMode /></RoleRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
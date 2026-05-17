import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/common/HomePage';
import ProblemList from './components/problems/ProblemList';
import ProblemPage from './components/problems/ProblemPage';
import ProblemForm from './components/problems/ProblemForm';
import SubmissionHistory from './components/submissions/SubmissionHistory';
import Leaderboard from './components/common/Leaderboard';
import Profile from './components/auth/Profile';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin/problems' : '/'} />}
          />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/submissions" element={<SubmissionHistory />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin/problems" element={<ProblemForm />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ProfileSetup1  from './pages/ProfileSetup1';
import ProfileSetup2  from './pages/ProfileSetup2';
import ProfileSetup3  from './pages/ProfileSetup3';
import Dashboard      from './pages/Dashboard';
import Checkin        from './pages/Checkin';
import CheckinResult  from './pages/CheckinResult';
import Trends         from './pages/Trends';
import Photos         from './pages/Photos';
import AlertDetail    from './pages/AlertDetail';
import ConditionDetail from './pages/ConditionDetail';
import DentistFinder  from './pages/DentistFinder';
import Settings       from './pages/Settings';
import EditProfile    from './pages/EditProfile';
import Notifications  from './pages/Notifications';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function Router() {
  return (
    <Routes>
      {}
      <Route path="/"        element={<Landing />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/signup"  element={<Signup />} />
      <Route path="/forgot"  element={<ForgotPassword />} />

      {}
      <Route path="/profile/1" element={<ProfileSetup1 />} />
      <Route path="/profile/2" element={<ProfileSetup2 />} />
      <Route path="/profile/3" element={<ProfileSetup3 />} />

      {}
      <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/checkin"    element={<ProtectedRoute><Checkin /></ProtectedRoute>} />
      <Route path="/result"     element={<ProtectedRoute><CheckinResult /></ProtectedRoute>} />
      <Route path="/trends"     element={<ProtectedRoute><Trends /></ProtectedRoute>} />
      <Route path="/photos"     element={<ProtectedRoute><Photos /></ProtectedRoute>} />
      <Route path="/alert"      element={<ProtectedRoute><AlertDetail /></ProtectedRoute>} />
      <Route path="/condition"  element={<ProtectedRoute><ConditionDetail /></ProtectedRoute>} />
      <Route path="/dentist"    element={<ProtectedRoute><DentistFinder /></ProtectedRoute>} />

      {}
      <Route path="/settings"               element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/settings/profile"       element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/settings/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

      {}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
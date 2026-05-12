import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import AppLayout from '@/components/templates/AppLayout';
import LoginPage from '@/pages/LoginPage';
import MeetingsPage from '@/pages/MeetingsPage';
import MeetingDetailPage from '@/pages/MeetingDetailPage';
import TasksPage from '@/pages/TasksPage';
import { authService } from '@/services/auth';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!authService.isLoggedIn()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  useTheme();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<Navigate to="/meetings" replace />} />
        <Route path="/meetings"     element={<MeetingsPage />} />
        <Route path="/meetings/:id" element={<MeetingDetailPage />} />
        <Route path="/tasks"        element={<TasksPage />} />
      </Route>
    </Routes>
  );
}

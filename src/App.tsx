import { Suspense, lazy, type ReactElement } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { isAdminSessionActive } from './utils/adminSession';
import { getAuthUser, isAuthenticated } from './utils/rbacAuth';
import { ThemeToggle } from './components/ThemeToggle';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleRoute = ({
  children,
  role,
}: {
  children: ReactElement;
  role: 'student' | 'admin' | 'industry' | 'college' | 'faculty';
}) => {
  const user = getAuthUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    if (user.role === 'college') return <Navigate to="/college/placements" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/pending-approvals" replace />;
    if (user.role === 'industry') return <Navigate to="/industry" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminAccessRoute = ({ children }: { children: ReactElement }) => {
  const user = getAuthUser();
  if (user?.role === 'college') {
    return <Navigate to="/college/placements" replace />;
  }
  if (user?.role === 'admin') {
    return children;
  }
  if (isAdminSessionActive()) {
    return children;
  }
  if (isAuthenticated()) {
    const u = getAuthUser();
    if (u?.role === 'industry') return <Navigate to="/industry" replace />;
    if (u?.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/admin-login" replace />;
};

const PublicOnlyRoute = ({ children }: { children: ReactElement }) => {
  if (isAuthenticated()) {
    const user = getAuthUser();
    if (user?.role === 'college') return <Navigate to="/college/placements" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/pending-approvals" replace />;
    if (user?.role === 'industry') return <Navigate to="/industry" replace />;
    if (user?.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminSessionRoute = ({ children }: { children: ReactElement }) => {
  if (!isAdminSessionActive() && getAuthUser()?.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
    Loading…
  </div>
);

const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage ?? m.default })));
const Login = lazy(() => import('./pages/Auth/Login').then((m) => ({ default: m.Login ?? m.default })));
const Signup = lazy(() => import('./pages/Auth/Signup').then((m) => ({ default: m.Signup ?? m.default })));
const VerifyOTP = lazy(() => import('./pages/Auth/VerifyOTP').then((m) => ({ default: m.VerifyOTP ?? m.default })));
const VerifyCollege = lazy(() =>
  import('./pages/Auth/VerifyCollege').then((m) => ({ default: m.VerifyCollege ?? m.default })),
);
const OnboardingAnalyze = lazy(() =>
  import('./pages/Auth/OnboardingAnalyze').then((m) => ({ default: m.OnboardingAnalyze ?? m.default })),
);
const DashboardLayout = lazy(() =>
  import('./layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout ?? m.default })),
);
const CollegeLayout = lazy(() =>
  import('./layouts/CollegeLayout').then((m) => ({ default: m.CollegeLayout ?? m.default })),
);
const StudentDashboard = lazy(() =>
  import('./pages/Dashboard/StudentDashboard').then((m) => ({ default: m.StudentDashboard ?? m.default })),
);
const RoadmapList = lazy(() =>
  import('./pages/Roadmaps/RoadmapList').then((m) => ({ default: m.RoadmapList ?? m.default })),
);
const RoadmapDetail = lazy(() =>
  import('./pages/Roadmaps/RoadmapDetail').then((m) => ({ default: m.RoadmapDetail ?? m.default })),
);
const Assessments = lazy(() =>
  import('./pages/Assessments/Assessments').then((m) => ({ default: m.Assessments ?? m.default })),
);
const BuddyChat = lazy(() => import('./pages/Buddy/BuddyChat').then((m) => ({ default: m.BuddyChat ?? m.default })));
const Leaderboard = lazy(() =>
  import('./pages/Gamification/Leaderboard').then((m) => ({ default: m.Leaderboard ?? m.default })),
);
const Rewards = lazy(() => import('./pages/Gamification/Rewards').then((m) => ({ default: m.Rewards ?? m.default })));
const Internships = lazy(() =>
  import('./pages/Career/Internships').then((m) => ({ default: m.Internships ?? m.default })),
);
const FacultyOpportunities = lazy(() =>
  import('./pages/Career/FacultyOpportunities').then((m) => ({ default: m.FacultyOpportunities ?? m.default })),
);
const CvBuilder = lazy(() =>
  import('./pages/Career/CvBuilder').then((m) => ({ default: m.CvBuilder ?? m.default })),
);
const CompanyDetail = lazy(() =>
  import('./pages/Career/CompanyDetail').then((m) => ({ default: m.CompanyDetail ?? m.default })),
);
const Events = lazy(() => import('./pages/Growth/Events').then((m) => ({ default: m.Events ?? m.default })));
const SoftSkills = lazy(() =>
  import('./pages/Growth/SoftSkills').then((m) => ({ default: m.SoftSkills ?? m.default })),
);
const AdminDashboard = lazy(() =>
  import('./pages/Admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard ?? m.default })),
);
const PendingApprovals = lazy(() =>
  import('./pages/Admin/PendingApprovals').then((m) => ({ default: m.PendingApprovals ?? m.default })),
);
const AdminLogin = lazy(() =>
  import('./pages/Admin/AdminLogin').then((m) => ({ default: m.AdminLogin ?? m.default })),
);
const CourseManager = lazy(() =>
  import('./pages/Admin/CourseManager').then((m) => ({ default: m.CourseManager ?? m.default })),
);
const ProfileDashboard = lazy(() =>
  import('./pages/Profile/ProfileDashboard').then((m) => ({ default: m.ProfileDashboard ?? m.default })),
);
const DSASheet = lazy(() => import('./pages/DSASheet').then((m) => ({ default: m.DSASheet ?? m.default })));
const SkillProfile = lazy(() =>
  import('./pages/SkillProfile').then((m) => ({ default: m.SkillProfile ?? m.default })),
);
const IndustryWorkspace = lazy(() =>
  import('./pages/Industry/IndustryWorkspace').then((m) => ({ default: m.IndustryWorkspace ?? m.default })),
);
const FacultyWorkspace = lazy(() =>
  import('./pages/Faculty/FacultyWorkspace').then((m) => ({ default: m.FacultyWorkspace ?? m.default })),
);
const PlacementDashboard = lazy(() =>
  import('./pages/Admin/PlacementDashboard').then((m) => ({ default: m.PlacementDashboard ?? m.default })),
);

const DASHBOARD_ROUTES = [
  '/dashboard',
  '/roadmaps',
  '/assessments',
  '/buddy',
  '/leaderboard',
  '/rewards',
  '/internships',
  '/faculty-opportunities',
  '/cv-builder',
  '/events',
  '/soft-skills',
  '/dsa-sheet',
  '/admin',
  '/profile',
  '/skill-profile',
  '/industry',
  '/college',
  '/faculty',
];

const AUTH_HIDE_GLOBAL_TOGGLE = [
  '/login',
  '/signup',
  '/sign-up',
  '/register',
  '/signin',
  '/sign-in',
  '/verify-otp',
  '/verify-college',
  '/onboarding',
  '/admin-login',
];

const GlobalThemeButton = () => {
  const location = useLocation();
  const path = location.pathname;
  const isDashboardArea = DASHBOARD_ROUTES.some(
    (route) => path === route || path.startsWith(route),
  );
  const isAuthPage = AUTH_HIDE_GLOBAL_TOGGLE.some(
    (route) => path === route || path.startsWith(route + '/'),
  );
  // One toggle only: dashboards have their own; auth pages render their own in-header toggle
  if (isDashboardArea || isAuthPage) return null;
  return <ThemeToggle movable />;
};

export function App() {
  return (
    <Router>
      <GlobalThemeButton />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/verify-otp" element={<PublicOnlyRoute><VerifyOTP /></PublicOnlyRoute>} />
          <Route path="/verify-college" element={<VerifyCollege />} />
          <Route path="/onboarding" element={<OnboardingAnalyze />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/course-manager" element={<AdminSessionRoute><CourseManager /></AdminSessionRoute>} />

          <Route
            path="/college"
            element={
              <ProtectedRoute>
                <RoleRoute role="college">
                  <CollegeLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/college/placements" replace />} />
            <Route path="placements" element={<PlacementDashboard />} />
          </Route>

          <Route
            path="/industry"
            element={
              <ProtectedRoute>
                <RoleRoute role="industry">
                  <IndustryWorkspace />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <RoleRoute role="faculty">
                  <FacultyWorkspace />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="roadmaps" element={<RoadmapList />} />
            <Route path="roadmaps/:id" element={<RoadmapDetail />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="buddy" element={<BuddyChat />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="internships" element={<Internships />} />
            <Route path="faculty-opportunities" element={<FacultyOpportunities />} />
            <Route path="cv-builder" element={<CvBuilder />} />
            <Route path="company/:id" element={<CompanyDetail />} />
            <Route path="events" element={<Events />} />
            <Route path="soft-skills" element={<SoftSkills />} />
            <Route path="dsa-sheet" element={<DSASheet />} />
            <Route path="profile" element={<ProfileDashboard />} />
            <Route path="skill-profile" element={<SkillProfile />} />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminAccessRoute>
                <DashboardLayout />
              </AdminAccessRoute>
            }
          >
            <Route index element={<Navigate to="/admin/pending-approvals" replace />} />
            <Route path="pending-approvals" element={<PendingApprovals />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<CourseManager />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

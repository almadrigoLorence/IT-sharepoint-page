import { HashRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Paths from './pages/Paths.jsx';
import Resources from './pages/Resources.jsx';
import Events from './pages/Events.jsx';
import Progress from './pages/Progress.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminTheme from './pages/admin/AdminTheme.jsx';
import AdminLayoutCustomizer from './pages/admin/AdminLayoutCustomizer.jsx';
import AdminTeam from './pages/admin/AdminTeam.jsx';
import AdminSite from './pages/admin/AdminSite.jsx';
import AdminCourses from './pages/admin/AdminCourses.jsx';
import AdminPaths from './pages/admin/AdminPaths.jsx';
import AdminResources from './pages/admin/AdminResources.jsx';
import AdminEvents from './pages/admin/AdminEvents.jsx';
import AdminProgress from './pages/admin/AdminProgress.jsx';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <DataProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/catalog" element={<PublicLayout><Catalog /></PublicLayout>} />
          <Route path="/catalog/:id" element={<PublicLayout><CourseDetail /></PublicLayout>} />
          <Route path="/paths" element={<PublicLayout><Paths /></PublicLayout>} />
          <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/progress" element={<PublicLayout><Progress /></PublicLayout>} />

          <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <PublicLayout><AdminLayout /></PublicLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="theme" element={<AdminTheme />} />
            <Route path="layout" element={<AdminLayoutCustomizer />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="site" element={<AdminSite />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="paths" element={<AdminPaths />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="progress" element={<AdminProgress />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AdminRouteGate from './admin/component/AdminRouteGate.tsx'
import AdminLoginPage from './admin/pages/AdminLoginPage.tsx'
import AdminDashboardPage from './admin/pages/AdminDashboardPage.tsx'
import ProjectDetailsPage from './pages/ProjectDetailsPage.tsx'
import AllProjectsPage from './pages/AllProjectsPage.tsx'
import AllBlogsPage from './pages/AllBlogsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/blogs" element={<AllBlogsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
        <Route path="/v3/admin/login-page" element={<AdminLoginPage />} />
        <Route
          path="/v4/admin/dashboard"
          element={
            <AdminRouteGate>
              <AdminDashboardPage />
            </AdminRouteGate>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

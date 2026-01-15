import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';

// ...existing code...

export default function AppRouter({
  children,
  projects
}: {
  children: React.ReactNode;
  projects: any[];
}) {
  return (
    <Routes>
      <Route path="/" element={children} />
      <Route path="/projects" element={<ProjectsPage projects={projects} />} />
    </Routes>
  );
}

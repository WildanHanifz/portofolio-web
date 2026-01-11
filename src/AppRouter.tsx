import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';

// ...existing code...

export default function AppRouter({
  children,
  setSelectedProject
}: {
  children: React.ReactNode;
  setSelectedProject: (project: any) => void;
}) {
  return (
    <Routes>
      <Route path="/" element={children} />
      <Route path="/projects" element={<ProjectsPage setSelectedProject={setSelectedProject} />} />
    </Routes>
  );
}

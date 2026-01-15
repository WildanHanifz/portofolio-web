import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectsPage from './pages/ProjectsPage';

// ...existing code...

export default function AppRouter({
  children,
  setSelectedProject,
  projects
}: {
  children: React.ReactNode;
  setSelectedProject: (project: any) => void;
  projects: any[];
}) {
  return (
    <Routes>
      <Route path="/" element={children} />
      <Route path="/projects" element={<ProjectsPage setSelectedProject={setSelectedProject} projects={projects} />} />
    </Routes>
  );
}

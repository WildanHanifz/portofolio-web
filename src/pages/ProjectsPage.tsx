import React from 'react';
import { ProjectData } from '../hooks/useLocalStorage';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface ProjectsPageProps {
  setSelectedProject: (project: ProjectData | null) => void;
  projects: ProjectData[];
}

export default function ProjectsPage({ setSelectedProject, projects }: ProjectsPageProps) {
  const navigate = useNavigate();
  const [selectedProject, setLocalSelectedProject] = React.useState<ProjectData | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="mb-6 text-ebony hover:underline">← Back</button>
      <h2 className="text-3xl font-display font-bold text-black mb-8">All Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 group cursor-pointer"
                onClick={() => setLocalSelectedProject(project)}
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-black mb-2 group-hover:text-ebony transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  {Array.isArray(project.tags) && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-ebony rounded-lg text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray rounded-lg text-sm">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-3">
                    <span className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1">
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Modal for selected project */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
                <button
                  onClick={() => setLocalSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  title="Close"
                >
                  <span className="text-gray-600">×</span>
                </button>
                <h3 className="text-2xl font-display font-bold mb-2 text-black">{selectedProject.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  {selectedProject.tags && selectedProject.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-ebony rounded-lg text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="prose max-w-none mb-4">
                  {selectedProject.description}
                </div>
                {/* Images slider */}
                <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 mb-6 relative">
                  {selectedProject.images && selectedProject.images.length > 0 ? (
                    <img
                      src={selectedProject.images[0]}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      style={{display: 'block'}}
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="flex gap-3">
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1"
                    >
                      Live Demo <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1"
                    >
                      GitHub <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

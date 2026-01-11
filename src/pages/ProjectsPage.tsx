import { useLocalStorage, ProjectData } from '../hooks/useLocalStorage';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface ProjectsPageProps {
  setSelectedProject: (project: ProjectData | null) => void;
}

export default function ProjectsPage({ setSelectedProject }: ProjectsPageProps) {
  const { projects } = useLocalStorage();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="mb-6 text-ebony hover:underline">← Back</button>
      <h2 className="text-3xl font-display font-bold text-black mb-8">All Projects</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 group cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="aspect-video overflow-hidden bg-gray-100">
              {project.image ? (
                <img
                  key={project.image}
                  src={project.image}
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
    </div>
  );
}

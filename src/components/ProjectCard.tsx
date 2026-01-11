import React, { useRef, useState, useEffect } from 'react';
import { ExternalLink, Github, Code } from 'lucide-react';
import { ProjectData } from '../hooks/useLocalStorage';

interface ProjectCardProps {
  project: ProjectData;
  onClick: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>, id: string) => void;
}

export function ProjectCard({ project, onClick, onImageError }: ProjectCardProps) {
  const images = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    intervalRef.current = window.setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, 2000);
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [images.length, paused]);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 group cursor-pointer"
      onClick={onClick}
    >
      <div
        className="aspect-video overflow-hidden bg-gray-100 relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.length > 0 ? (
          images.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={project.title}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-700 ${slide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{transitionProperty: 'opacity'}}
              onError={(e) => onImageError(e, project.id)}
              draggable={false}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${slide === idx ? 'bg-ebony' : 'bg-gray-300'} border border-white`}
              />
            ))}
          </div>
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
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1"
              onClick={e => e.stopPropagation()}
            >
              Live Demo <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1"
              onClick={e => e.stopPropagation()}
            >
              GitHub <Github className="w-4 h-4" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github.replace('github.com', 'github1s.com')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1"
              onClick={e => e.stopPropagation()}
            >
              Browse Code <Code className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

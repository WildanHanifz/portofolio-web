import React, { useState } from 'react';
import { ProjectData } from '../hooks/useLocalStorage';
import { X, ExternalLink, Github, Code, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectData;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const images = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);
  const [slide, setSlide] = useState(0);
  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlide((s) => (s - 1 + images.length) % images.length);
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlide((s) => (s + 1) % images.length);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          title="Close"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex flex-col gap-6">
          <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 mb-6 relative">
            {images.length > 0 ? (
              <>
                <img
                  src={images[slide]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  style={{display: 'block'}}
                  draggable={false}
                />
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                      onClick={goPrev}
                      tabIndex={0}
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                      onClick={goNext}
                      tabIndex={0}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                      {images.map((_, idx) => (
                        <span
                          key={idx}
                          className={`w-2 h-2 rounded-full ${slide === idx ? 'bg-ebony' : 'bg-gray-300'} border border-white`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <h3 className="text-2xl font-display font-bold mb-2 text-black">{project.title}</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {project.description}
          </p>
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-ebony rounded-lg text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ebony hover:text-black font-medium text-sm transition-colors flex items-center gap-1"
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
              >
                Browse Code <Code className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

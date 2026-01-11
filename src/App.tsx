import React, { useState } from 'react';
import { Calendar, Tag, X, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocalStorage, ProjectData, BlogPost, SocialLink } from './hooks/useLocalStorage';
import { EditMode } from './components/EditMode';
import { getSocialIcon } from './utils/getSocialIcon';
// import ErrorBoundary from './components/ErrorBoundary';
import { Link } from 'react-router-dom';
import AppRouter from './AppRouter';
import { ProjectCard } from './components/ProjectCard.tsx';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x450?text=No+image';

// Project image error handler
const handleProjectImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = PLACEHOLDER_IMAGE;
};

function HomePage() {
  // Restore all required state and logic
  // useLocalStorage returns an object, not array
  const {
    profile,
    projects,
    posts,
    theme,
    saveProfile,
    saveProjects,
    savePosts,
    saveTheme,
    exportData,
    importData,
    resetData,
    checkPassword,
  } = useLocalStorage();
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Listen for scroll to update headerScrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sorted posts for blog
  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Avatar image error handler
  const handleAvatarImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };
  return (
    <AppRouter setSelectedProject={setSelectedProject}>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Header Section (only title & subtitle) */}
      {profile.showHeader && (
        <section className={`relative w-full min-h-screen flex items-center justify-center transition-all duration-500 ${headerScrolled ? 'shadow-lg' : ''}`}>
          {/* Background Image/Slider */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {profile.headerSlides && profile.headerSlides.length > 0 ? (
              <div className="w-full h-full relative">
                {profile.headerSlides.map((src: string, idx: number) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Header Slide ${idx+1}`}
                    className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    style={{transitionProperty: 'opacity'}}
                  />
                ))}
              </div>
            ) : profile.headerImage ? (
              <img
                src={profile.headerImage}
                alt="Header"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/10" />
            {/* Black transparent overlay above image */}
            <div className="absolute inset-0 w-full h-full bg-black/40 pointer-events-none z-10" />
          </div>
          {/* Floating Nav */}
          <nav
            className={`fixed top-0 left-0 w-full flex justify-center items-center h-16 z-30 transition-all duration-300 ${headerScrolled ? 'bg-[#243041] shadow-lg' : 'bg-transparent'}`}
            style={{ backdropFilter: !headerScrolled ? 'blur(0.5px)' : undefined }}
          >
            <div className="w-full max-w-6xl flex items-center justify-between px-8">
              <span className={`font-display font-bold text-2xl tracking-tight transition-colors duration-300 ${headerScrolled ? 'text-white' : 'text-white'}`}>{profile.name || 'Profile'}</span>
              <ul className="flex gap-8 text-lg font-display font-semibold">
                <li>
                  <button onClick={() => scrollToSection('about')} className={`hover:underline transition-colors duration-300 ${headerScrolled ? 'text-white' : 'text-white'}`}>About</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('projects')} className={`hover:underline transition-colors duration-300 ${headerScrolled ? 'text-white' : 'text-white'}`}>Projects</button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('blog')} className={`hover:underline transition-colors duration-300 ${headerScrolled ? 'text-white' : 'text-white'}`}>Blog</button>
                </li>
              </ul>
            </div>
          </nav>
          {/* Header Content: Only title & subtitle, centered */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 w-full">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg">{profile.headerTitle}</h1>
            <h2 className="text-2xl md:text-3xl font-medium mb-4 drop-shadow">{profile.headerSubtitle}</h2>
          </div>
          {/* Slider Dots */}
          {profile.headerSlides && profile.headerSlides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {profile.headerSlides.map((_: string, idx: number) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-white' : 'bg-white/40'} border border-white`}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* About Section: avatar, name, role, bio, social links wrapped in box */}
      <section id="about" className="max-w-3xl mx-auto px-6 py-8 flex justify-center animate-fade-in">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 flex flex-col mb-6 border border-gray-200 mx-auto">
          <div className="flex flex-row flex-wrap items-center gap-8 mb-4 min-w-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-28 h-28 rounded-2xl border-2 border-gray-200 shadow object-cover bg-white flex-shrink-0"
              onError={handleAvatarImageError}
            />
            <div className="flex flex-col items-start flex-1 min-w-0">
              <h2 className="text-3xl font-display font-bold mb-1 break-words">{profile.name}</h2>
              <h3 className="text-lg font-medium text-gray-700 mb-1 break-words">{profile.role}</h3>
              <p className="text-base text-gray-500 mb-0 break-words whitespace-pre-line">{profile.bio}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-start gap-3 mt-2 pl-36 min-w-0">
            {profile.socialLinks.map((link: SocialLink) => {
              const Icon = getSocialIcon(link.label, link.url);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-ebony hover:text-white rounded-xl transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full px-0 py-16 animate-fade-in">
        <hr className="border-t border-gray-200 w-full m-0 p-0" />
        <div className="bg-gray-100 w-full px-0">
          <div className="max-w-6xl mx-auto px-8 py-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display font-bold">Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.slice(0, 4).map((project: ProjectData) => (
                <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} onImageError={handleProjectImageError} />
              ))}
              {/* Project Modal */}
              {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      title="Close"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                    <h3 className="text-2xl font-display font-bold mb-2 text-black">{selectedProject.title}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                      {selectedProject.tags && selectedProject.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-ebony rounded-lg text-sm font-medium">
                          <Tag className="w-3 h-3 inline-block mr-1" />{tag}
                        </span>
                      ))}
                    </div>
                    <div className="prose max-w-none mb-4">
                      <ReactMarkdown>{selectedProject.description || ''}</ReactMarkdown>
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
                          GitHub <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-8">
              <Link to="/projects" className="text-ebony hover:underline text-lg">See more →</Link>
            </div>
            {projects.length === 0 && (
                  <p className="text-gray-500">No projects found.</p>
                )}
          </div>
        </div>
        <hr className="border-t border-gray-200 w-full m-0 p-0" />
      </section>

      {/* Blog Section */}
      <section id="blog" className="max-w-6xl mx-auto px-6 py-16 animate-fade-in">
        <h2 className="text-3xl font-display font-bold mb-8">Blog</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {sortedPosts.slice(0, 4).map((post: BlogPost) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 group cursor-pointer flex flex-col"
              onClick={() => setSelectedPost(post)}
            >
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-bold text-black mb-2 group-hover:text-ebony transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <p className="text-gray mb-4 leading-relaxed line-clamp-2">
                  {post.excerpt || post.content.slice(0, 100) + '...'}
                </p>
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {post.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-ebony rounded-lg text-sm font-medium"
                      >
                        <Tag className="w-3 h-3 inline-block mr-1" />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-gray-500">No blog posts found.</p>
        )}
      </section>

      {/* Blog Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              title="Close"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <h3 className="text-2xl font-display font-bold mb-2 text-black">{selectedPost.title}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <Calendar className="w-4 h-4" />
              <span>{selectedPost.date}</span>
            </div>
            <div className="prose max-w-none">
              <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            </div>
            {Array.isArray(selectedPost.tags) && selectedPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPost.tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-ebony rounded-lg text-sm font-medium"
                  >
                    <Tag className="w-3 h-3 inline-block mr-1" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 bg-[var(--color-secondary)] text-center text-[var(--color-text)]">
        <small>Wildnnh &copy; {new Date().getFullYear()}</small>
      </footer>

      {/* Edit Mode Floating Button & Panel */}
      <EditMode
        profile={profile}
        projects={projects}
        posts={posts}
        theme={theme}
        onSaveProfile={saveProfile}
        onSaveProjects={saveProjects}
        onSavePosts={savePosts}
        onSaveTheme={saveTheme}
        onExport={exportData}
        onImport={importData}
        onReset={resetData}
        onCheckPassword={checkPassword}
      />
    </div>
    </AppRouter>
  );
}

export default HomePage;

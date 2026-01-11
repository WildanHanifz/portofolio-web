import { useState, useEffect } from 'react';
import { Settings, X, Download, Upload, RefreshCw } from 'lucide-react';
import { ProfileData, ProjectData, BlogPost, ThemeColors } from '../hooks/useLocalStorage';
import { uploadToImgBB } from '../utils/uploadToImgBB';

interface EditModeProps {
  profile: ProfileData;
  projects: ProjectData[];
  posts: BlogPost[];
  theme: ThemeColors;
  onSaveProfile: (data: ProfileData) => void;
  onSaveProjects: (data: ProjectData[]) => void;
  onSavePosts: (data: BlogPost[]) => void;
  onSaveTheme: (data: ThemeColors) => void;
  onExport: () => void;
  onImport: (json: string) => boolean;
  onReset: () => void;
  onCheckPassword: (password: string) => boolean;
}

export function EditMode({
  profile,
  projects,
  posts,
  theme,
  onSaveProfile,
  onSaveProjects,
  onSavePosts,
  onSaveTheme,
  onExport,
  onImport,
  onReset,
  onCheckPassword,
}: EditModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'blog' | 'theme'>('profile');
  const [editProfile, setEditProfile] = useState(profile);
  const [editProjects, setEditProjects] = useState(projects);
  const [editPosts, setEditPosts] = useState(posts);
  const [editTheme, setEditTheme] = useState(theme);
  const [savedMessage, setSavedMessage] = useState('');
  const [externalAvatarUrl, setExternalAvatarUrl] = useState('');
  const [externalHeaderUrl, setExternalHeaderUrl] = useState('');
  const [externalProjectUrls, setExternalProjectUrls] = useState<string[]>(() => projects.map(() => ''));

  // Sync editProfile when profile props change (important for loading saved data)
  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  // Sync editProjects when projects props change
  useEffect(() => {
    setEditProjects(projects);
    setExternalProjectUrls(projects.map(() => ''));
  }, [projects]);

  // Sync editPosts when posts props change
  useEffect(() => {
    setEditPosts(posts);
  }, [posts]);

  // Sync editTheme when theme props change
  useEffect(() => {
    setEditTheme(theme);
  }, [theme]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCheckPassword(passwordInput)) {
      setIsAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError('Password salah!');
      setPasswordInput('');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setPasswordInput('');
    setPasswordError('');
  };

  // Auto-save profile changes
  const updateProfile = (updates: Partial<ProfileData>) => {
    const updated = { ...editProfile, ...updates };
    setEditProfile(updated);
    onSaveProfile(updated);
    setSavedMessage('Saved');
    setTimeout(() => setSavedMessage(''), 1800);
  };

  // Auto-save theme changes
  const updateTheme = (updates: Partial<ThemeColors>) => {
    const updated = { ...editTheme, ...updates };
    setEditTheme(updated);
    onSaveTheme(updated);
    setSavedMessage('Saved');
    setTimeout(() => setSavedMessage(''), 1800);
  };

  // Auto-save project changes
  const updateProjects = (updated: ProjectData[]) => {
    setEditProjects(updated);
    onSaveProjects(updated);
    setSavedMessage('Saved');
    setTimeout(() => setSavedMessage(''), 1800);
  };

  // Auto-save post changes
  const updatePosts = (updated: BlogPost[]) => {
    setEditPosts(updated);
    onSavePosts(updated);
    setSavedMessage('Saved');
    setTimeout(() => setSavedMessage(''), 1800);
  };

  const handleSave = () => {
    // Projects and Posts are auto-saved, so just save remaining items
    onSaveTheme(editTheme);
    // Export a backup file when user explicitly saves
    onExport();
    setSavedMessage('Saved & Exported');
    setTimeout(() => setSavedMessage(''), 2200);
    handleClose();
  };

  // Simple URL validator
  const isValidUrl = (value: string) => {
    if (!value) return false;
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (onImport(content)) {
            alert('Import successful!');
            setIsOpen(false);
            window.location.reload();
          } else {
            alert('Import failed. Check console for errors.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const addProject = () => {
    const updated = [
      ...editProjects,
      {
        id: Date.now().toString(),
        title: 'New Project',
        description: 'Description',
        image: 'https://via.placeholder.com/400x300',
        images: [],
        tags: [],
        link: '',
        github: '',
      },
    ];
    setEditProjects(updated);
    // Update parent immediately so the new project appears in the UI without closing
    onSaveProjects(updated);
  };

  const removeProject = (id: string) => {
    const updated = editProjects.filter(p => p.id !== id);
    setEditProjects(updated);
    // Persist removal immediately
    onSaveProjects(updated);
  };

  const addPost = () => {
    const updated = [
      ...editPosts,
      {
        id: Date.now().toString(),
        title: 'New Post',
        date: new Date().toISOString().split('T')[0],
        excerpt: 'Post excerpt',
        content: 'Post content',
        tags: [],
      },
    ];
    setEditPosts(updated);
    // Update parent immediately so the new post appears in the UI without closing
    onSavePosts(updated);
  };

  const removePost = (id: string) => {
    const updated = editPosts.filter(p => p.id !== id);
    setEditPosts(updated);
    // Persist removal immediately
    onSavePosts(updated);
  };

  return (
    <>
      {/* Floating Edit Button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 w-14 h-14 bg-ebony hover:bg-ebony-light text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        title="Edit Mode"
      >
        <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Edit Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {!isAuthenticated ? (
            /* Password Login */
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-ebony rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-display font-bold text-black mb-2">Edit Mode</h2>
                <p className="text-gray text-sm">Masukkan password untuk mengakses</p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ebony"
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-ebony hover:bg-ebony-light text-white rounded-xl font-medium transition-colors"
                >
                  Masuk
                </button>
                
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 border border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray text-center">
                  Password default: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
                  <br />
                  <span className="text-xs text-gray-400">Ganti password di tab Profile</span>
                </p>
              </div>
            </div>
          ) : (
            /* Main Edit Panel */
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-ebony to-black p-6 text-white relative">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold">Edit Your Profile</h2>
                <button
                  onClick={handleClose}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {savedMessage && (
                <div className="absolute right-6 top-6 bg-white/90 text-black px-3 py-1 rounded-full shadow-md text-sm">
                  {savedMessage}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={handleImport}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </button>
                <button
                  onClick={() => {
                    if (confirm('Reset all data to default?')) {
                      onReset();
                      setIsOpen(false);
                      window.location.reload();
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-300 bg-gray-100">
              {['profile', 'projects', 'blog', 'theme'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-ebony border-b-2 border-ebony'
                      : 'text-gray hover:text-ebony'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => updateProfile({ name: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                    <input
                      type="text"
                      value={editProfile.role}
                      onChange={(e) => updateProfile({ role: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
                    <textarea
                      value={editProfile.bio}
                      onChange={(e) => updateProfile({ bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Avatar Image (upload)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
                        <img src={editProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const imageUrl = await uploadToImgBB(file);
                                updateProfile({ avatar: imageUrl });
                              } catch (err) {
                                // eslint-disable-next-line no-console
                                console.error('Failed to upload image:', err);
                                alert('Failed to upload image. Please check your API key and try again.');
                              }
                            }
                          }}
                          className="w-full"
                        />
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Or paste image URL (ImgBB)"
                            value={externalAvatarUrl}
                            onChange={(e) => setExternalAvatarUrl(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const url = externalAvatarUrl.trim();
                              if (!url) return;
                              if (!isValidUrl(url)) {
                                alert('Invalid URL. Please paste a full http(s) URL from ImgBB.');
                                return;
                              }
                              updateProfile({ avatar: url });
                              setExternalAvatarUrl('');
                            }}
                            className="px-3 py-2 rounded-xl bg-ebony text-white"
                          >
                            Use URL
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Upload an image file; it will be saved to localStorage.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-300">
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={editProfile.showHeader}
                        onChange={(e) => updateProfile({ showHeader: e.target.checked })}
                        className="rounded"
                      />
                      <label className="text-sm font-medium text-gray-600">Show Header Banner</label>
                    </div>
                    {editProfile.showHeader && (
                      <>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Header Title</label>
                          <input
                            type="text"
                            value={editProfile.headerTitle}
                            onChange={(e) => updateProfile({ headerTitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Header Subtitle</label>
                          <input
                            type="text"
                            value={editProfile.headerSubtitle}
                            onChange={(e) => updateProfile({ headerSubtitle: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Header Slides (upload multiple)</label>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-3">
                              {(editProfile.headerSlides || []).map((src, sidx) => (
                                <div key={sidx} className="w-40 h-24 relative rounded overflow-hidden bg-gray-50 border border-gray-200">
                                  <img src={src} alt={`slide-${sidx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...(editProfile.headerSlides || [])];
                                      updated.splice(sidx, 1);
                                      updateProfile({ headerSlides: updated });
                                    }}
                                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-600 hover:bg-white"
                                    title="Remove slide"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const imageUrl = await uploadToImgBB(file);
                                      const updated = [...(editProfile.headerSlides || []), imageUrl];
                                      updateProfile({ headerSlides: updated });
                                    } catch (err) {
                                      // eslint-disable-next-line no-console
                                      console.error('Failed to upload image:', err);
                                      alert('Failed to upload image. Please check your API key and try again.');
                                    }
                                  }
                                }}
                                className="w-full"
                              />
                                    <div className="mt-0 flex gap-2 w-full">
                                      <input
                                        type="text"
                                        placeholder="Or paste ImgBB image URL"
                                        value={externalHeaderUrl}
                                        onChange={(e) => setExternalHeaderUrl(e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const url = externalHeaderUrl.trim();
                                          if (!url) return;
                                          if (!isValidUrl(url)) {
                                            alert('Invalid URL. Please paste a full http(s) URL from ImgBB.');
                                            return;
                                          }
                                          const updated = [...(editProfile.headerSlides || []), url];
                                          updateProfile({ headerSlides: updated });
                                          setExternalHeaderUrl('');
                                        }}
                                        className="px-3 py-2 rounded-xl bg-ebony text-white"
                                      >
                                        Use URL
                                      </button>
                                    </div>
                              <p className="text-xs text-gray-500">Upload slide images; they will be saved locally. Add multiple slides to create a slider.</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-300">
                    <h3 className="font-semibold text-black mb-3">Security</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Edit Password</label>
                      <input
                        type="text"
                        value={editProfile.editPassword}
                        onChange={(e) => updateProfile({ editPassword: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                        placeholder="Password untuk akses edit mode"
                      />
                      <p className="text-xs text-gray-500 mt-1">Ganti password untuk keamanan</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-300">
                    <h3 className="font-semibold text-black mb-3">Social Links</h3>
                    <div className="space-y-3">
                      {editProfile.socialLinks.map((link, idx) => (
                        <div key={link.id} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                            <input
                              type="text"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...editProfile.socialLinks];
                                updated[idx].label = e.target.value;
                                updateProfile({ socialLinks: updated });
                              }}
                              placeholder="e.g., Email, GitHub, Portfolio"
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony text-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => {
                                const updated = [...editProfile.socialLinks];
                                updated[idx].url = e.target.value;
                                updateProfile({ socialLinks: updated });
                              }}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editProfile.socialLinks.filter((_, i) => i !== idx);
                              updateProfile({ socialLinks: updated });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove link"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...editProfile.socialLinks, {
                          id: Date.now().toString(),
                          label: 'New Link',
                          url: 'https://',
                        }];
                        updateProfile({ socialLinks: updated });
                      }}
                      className="w-full mt-3 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg font-medium transition-colors text-sm"
                    >
                      + Add Social Link
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Icons auto-detect based on label/URL. Email, GitHub, LinkedIn, Instagram, Twitter, etc. are auto-detected!</p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <button
                    onClick={addProject}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl font-medium transition-colors"
                  >
                    + Add Project
                  </button>
                  {editProjects.map((project, idx) => (
                    <div key={project.id} className="p-4 bg-white rounded-xl border border-gray-300 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-black">Project {idx + 1}</span>
                        <button
                          onClick={() => removeProject(project.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].title = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="Title"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].description = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="Description"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          {/* Multi-image preview */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(project.images && project.images.length > 0 ? project.images : project.image ? [project.image] : []).map((img, imgIdx) => (
                              <div key={imgIdx} className="relative w-20 h-16 rounded overflow-hidden bg-gray-50 border border-gray-200">
                                <img src={img} alt="project" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-white/80 hover:bg-red-500 hover:text-white text-xs rounded-bl px-1 py-0.5"
                                  title="Remove image"
                                  onClick={() => {
                                    const updated = [...editProjects];
                                    const imgs = (updated[idx].images && updated[idx].images.length > 0 ? [...updated[idx].images] : updated[idx].image ? [updated[idx].image] : []);
                                    imgs.splice(imgIdx, 1);
                                    updated[idx].images = imgs;
                                    // Remove legacy .image if present and images is now the source of truth
                                    if (imgs.length > 0) updated[idx].image = imgs[0];
                                    else updated[idx].image = '';
                                    updateProjects(updated);
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                          {/* Multi-image upload */}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                try {
                                  const uploaded: string[] = [];
                                  for (let i = 0; i < files.length; i++) {
                                    const imageUrl = await uploadToImgBB(files[i]);
                                    uploaded.push(imageUrl);
                                  }
                                  const updated = [...editProjects];
                                  let imgs = (updated[idx].images && updated[idx].images.length > 0 ? [...updated[idx].images] : updated[idx].image ? [updated[idx].image] : []);
                                  imgs = imgs.concat(uploaded);
                                  updated[idx].images = imgs;
                                  updated[idx].image = imgs[0] || '';
                                  updateProjects(updated);
                                } catch (err) {
                                  // eslint-disable-next-line no-console
                                  console.error('Failed to upload image:', err);
                                  alert('Failed to upload image. Please check your API key and try again.');
                                }
                              }
                            }}
                            className="w-full"
                          />
                          <div className="mt-2 flex gap-2">
                            <input
                              type="text"
                              placeholder="Or paste multiple ImgBB URLs (comma separated)"
                              value={externalProjectUrls[idx] || ''}
                              onChange={(e) =>
                                setExternalProjectUrls((prev) => {
                                  const copy = [...prev];
                                  copy[idx] = e.target.value;
                                  return copy;
                                })
                              }
                              className="flex-1 px-3 py-2 rounded-xl border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const urls = (externalProjectUrls[idx] || '').split(',').map(u => u.trim()).filter(Boolean);
                                if (urls.length === 0) return;
                                if (!urls.every(isValidUrl)) {
                                  alert('Invalid URL. Please paste only full http(s) URLs from ImgBB, comma separated.');
                                  return;
                                }
                                const updated = [...editProjects];
                                let imgs = (updated[idx].images && updated[idx].images.length > 0 ? [...updated[idx].images] : updated[idx].image ? [updated[idx].image] : []);
                                imgs = imgs.concat(urls);
                                updated[idx].images = imgs;
                                updated[idx].image = imgs[0] || '';
                                updateProjects(updated);
                                setExternalProjectUrls((prev) => {
                                  const copy = [...prev];
                                  copy[idx] = '';
                                  return copy;
                                });
                              }}
                              className="px-3 py-2 rounded-xl bg-ebony text-white"
                            >
                              Use URLs
                            </button>
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={project.link || ''}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].link = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="Live Demo URL (optional)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                      <input
                        type="text"
                        value={project.github || ''}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].github = e.target.value;
                          updateProjects(updated);
                        }}
                        placeholder="GitHub Repository URL (https://github.com/user/repo)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                      <input
                        type="text"
                        value={project.tags.join(', ')}
                        onChange={(e) => {
                          const updated = [...editProjects];
                          updated[idx].tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                          updateProjects(updated);
                        }}
                        placeholder="Tags (comma separated)"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'blog' && (
                <div className="space-y-4">
                  <button
                    onClick={addPost}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl font-medium transition-colors"
                  >
                    + Add Post
                  </button>
                  {editPosts.map((post, idx) => (
                    <div key={post.id} className="p-4 bg-white rounded-xl border border-gray-300 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-black">Post {idx + 1}</span>
                        <button
                          onClick={() => removePost(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={post.title}
                        onChange={(e) => {
                          const updated = [...editPosts];
                          updated[idx].title = e.target.value;
                          updatePosts(updated);
                        }}
                        placeholder="Title"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                      <input
                        type="date"
                        value={post.date}
                        onChange={(e) => {
                          const updated = [...editPosts];
                          updated[idx].date = e.target.value;
                          updatePosts(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                      <textarea
                        value={post.content}
                        onChange={(e) => {
                          const updated = [...editPosts];
                          updated[idx].content = e.target.value;
                          updatePosts(updated);
                        }}
                        placeholder="Content (Markdown supported)"
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">Customize your site colors</p>
                  {Object.entries(editTheme).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-600 mb-2 capitalize">
                        {key}
                      </label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => updateTheme({ [key]: e.target.value } as Partial<ThemeColors>)}
                          className="h-12 w-12 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateTheme({ [key]: e.target.value } as Partial<ThemeColors>)}
                          className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ebony font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-100 border-t border-gray-300 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 rounded-xl border border-gray-300 hover:bg-gray-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-ebony to-black text-white font-medium hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
          )}
        </div>
      )}
    </>
  );
}

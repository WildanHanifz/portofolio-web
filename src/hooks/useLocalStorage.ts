import { useState, useEffect } from 'react';

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface ProfileData {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLink[];
  website: string;
  headerTitle: string;
  headerSubtitle: string;
  showHeader: boolean;
  headerImage: string;
  headerSlides?: string[];
  editPassword: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  images: string[]; // Multiple images
  /**
   * @deprecated Use images[0] instead
   */
  image?: string;
  tags: string[];
  link: string;
  github: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

const defaultProfile: ProfileData = {
  name: 'Your Name',
  role: 'Developer & Designer',
  bio: 'I love building beautiful and functional web experiences.',
  // Embedded placeholder to avoid external network dependency
  avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect fill='%23f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial' font-size='20'>Avatar</text></svg>",
  socialLinks: [
    { id: '1', label: 'Email', url: 'mailto:hello@example.com' },
    { id: '2', label: 'GitHub', url: 'https://github.com/yourusername' },
    { id: '3', label: 'LinkedIn', url: 'https://linkedin.com/in/yourusername' },
    { id: '4', label: 'Instagram', url: 'https://instagram.com/yourusername' },
  ],
  website: 'https://yourwebsite.com',
  headerTitle: 'Welcome to My Space',
  headerSubtitle: 'Where creativity meets code',
  showHeader: true,
  headerImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop',
  headerSlides: [
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&auto=format&fit=crop',
  ],
  editPassword: 'admin123',
};

const defaultProjects: ProjectData[] = [
  {
    id: '1',
    title: 'Project 1',
    description: 'A cool project I built',
    images: [
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial' font-size='24'>No+image</text></svg>"
    ],
    tags: ['React', 'TypeScript'],
    link: 'https://example.com',
    github: 'https://github.com/user/repo',
  },
];

const defaultPosts: BlogPost[] = [
  {
    id: '1',
    title: 'My First Post',
    date: '2024-01-15',
    excerpt: 'This is my first blog post...',
    content: 'Welcome to my blog! This is where I share my thoughts and experiences.',
    tags: ['intro', 'personal'],
  },
];

const defaultTheme: ThemeColors = {
  primary: '#44444C',
  secondary: '#8C8C8C',
  accent: '#D6D6D6',
  background: '#ffffff',
  text: '#0B0909',
};

export function useLocalStorage() {
  // Initialize state - will be updated after mount via useEffect
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [projects, setProjects] = useState<ProjectData[]>(defaultProjects);
  const [posts, setPosts] = useState<BlogPost[]>(defaultPosts);
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  // Load from localStorage on mount and keep in sync
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[useLocalStorage] mounting - loading from localStorage');
    
    try {
      const savedProfile = localStorage.getItem('profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        // eslint-disable-next-line no-console
        console.log('[useLocalStorage] loaded profile from localStorage:', parsedProfile.name);
        setProfile(parsedProfile);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useLocalStorage] failed to parse profile from localStorage');
    }

    try {
      const savedProjects = localStorage.getItem('projects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        // eslint-disable-next-line no-console
        console.log('[useLocalStorage] loaded projects from localStorage:', parsedProjects.length);
        setProjects(parsedProjects);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useLocalStorage] failed to parse projects from localStorage');
    }

    try {
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // eslint-disable-next-line no-console
        console.log('[useLocalStorage] loaded posts from localStorage:', parsedPosts.length);
        setPosts(parsedPosts);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useLocalStorage] failed to parse posts from localStorage');
    }

    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        // eslint-disable-next-line no-console
        console.log('[useLocalStorage] loaded theme from localStorage');
        setTheme(parsedTheme);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[useLocalStorage] failed to parse theme from localStorage');
    }
  }, []);

  // Migrate old profile format to new socialLinks format
  const migrateProfile = (savedData: any): ProfileData => {
    // If already has socialLinks, return as-is
    if (savedData.socialLinks) {
      return savedData;
    }
    
    // Convert old fields to new socialLinks array
    const socialLinks: SocialLink[] = [];
    let id = 1;
    
    if (savedData.email) {
      socialLinks.push({ id: String(id++), label: 'Email', url: `mailto:${savedData.email}` });
    }
    if (savedData.github) {
      socialLinks.push({ id: String(id++), label: 'GitHub', url: `https://github.com/${savedData.github}` });
    }
    if (savedData.linkedin) {
      socialLinks.push({ id: String(id++), label: 'LinkedIn', url: `https://linkedin.com/in/${savedData.linkedin}` });
    }
    if (savedData.instagram) {
      socialLinks.push({ id: String(id++), label: 'Instagram', url: `https://instagram.com/${savedData.instagram}` });
    }
    if (savedData.twitter) {
      socialLinks.push({ id: String(id++), label: 'Twitter', url: `https://twitter.com/${savedData.twitter}` });
    }
    
    return {
      ...savedData,
      socialLinks: socialLinks.length > 0 ? socialLinks : defaultProfile.socialLinks,
    };
  };

  // Load from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');

    // Migrate old profile format to new socialLinks if needed
    try {
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        const migratedProfile = migrateProfile(parsedProfile);
        // Only update if migration changed something
        if (JSON.stringify(migratedProfile) !== JSON.stringify(parsedProfile)) {
          // eslint-disable-next-line no-console
          console.log('[useLocalStorage] migrated profile format');
          setProfile(migratedProfile);
          localStorage.setItem('profile', JSON.stringify(migratedProfile));
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[useLocalStorage] failed to migrate profile', err);
    }
  }, []);

  // Save to localStorage
  const saveProfile = (data: ProfileData) => {
    // Debug
    // eslint-disable-next-line no-console
    console.log('[useLocalStorage] saveProfile', data);
    setProfile(data);
    localStorage.setItem('profile', JSON.stringify(data));
  };

  const saveProjects = (data: ProjectData[]) => {
    // Debug
    // eslint-disable-next-line no-console
    console.log('[useLocalStorage] saveProjects (count):', data.length);
    setProjects(data);
    localStorage.setItem('projects', JSON.stringify(data));
  };

  const savePosts = (data: BlogPost[]) => {
    // Debug
    // eslint-disable-next-line no-console
    console.log('[useLocalStorage] savePosts (count):', data.length);
    setPosts(data);
    localStorage.setItem('posts', JSON.stringify(data));
  };

  const saveTheme = (data: ThemeColors) => {
    // Debug
    // eslint-disable-next-line no-console
    console.log('[useLocalStorage] saveTheme', data);
    setTheme(data);
    localStorage.setItem('theme', JSON.stringify(data));
  };

  const exportData = () => {
    const data = {
      profile,
      projects,
      posts,
      theme,
      exportDate: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) saveProfile(data.profile);
      if (data.projects) saveProjects(data.projects);
      if (data.posts) savePosts(data.posts);
      if (data.theme) saveTheme(data.theme);
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  };

  const resetData = () => {
    setProfile(defaultProfile);
    setProjects(defaultProjects);
    setPosts(defaultPosts);
    setTheme(defaultTheme);
    localStorage.removeItem('profile');
    localStorage.removeItem('projects');
    localStorage.removeItem('posts');
    localStorage.removeItem('theme');
  };

  const checkPassword = (password: string): boolean => {
    if (!password) return false;
    const stored = (profile && profile.editPassword) || defaultProfile.editPassword;
    return password.trim() === stored.trim();
  };

  return {
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
  };
}

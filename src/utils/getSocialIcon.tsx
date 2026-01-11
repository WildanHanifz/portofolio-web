import { Mail, Github, Linkedin, Instagram, Twitter, Globe, Link2 } from 'lucide-react';

export function getSocialIcon(label: string, url: string) {
  const lowerLabel = label.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (lowerLabel.includes('email') || lowerUrl.includes('mailto:')) {
    return Mail;
  }
  if (lowerLabel.includes('github') || lowerUrl.includes('github.com')) {
    return Github;
  }
  if (lowerLabel.includes('linkedin') || lowerUrl.includes('linkedin.com')) {
    return Linkedin;
  }
  if (lowerLabel.includes('instagram') || lowerUrl.includes('instagram.com')) {
    return Instagram;
  }
  if (lowerLabel.includes('twitter') || lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return Twitter;
  }
  if (lowerLabel.includes('website') || lowerUrl.includes('http')) {
    return Globe;
  }
  
  return Link2;
}

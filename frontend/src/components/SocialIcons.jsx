import React from 'react';
import { Github, Linkedin, Youtube, Twitter, Instagram, Globe } from 'lucide-react';

export default function SocialIcons({ links }) {
  const icons = {
    githubUrl: <Github className="w-6 h-6" />,
    linkedinUrl: <Linkedin className="w-6 h-6" />,
    youtubeUrl: <Youtube className="w-6 h-6" />,
    twitterUrl: <Twitter className="w-6 h-6" />,
    instagramUrl: <Instagram className="w-6 h-6" />,
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {Object.entries(links).map(([key, url]) => {
        if (!url) return null;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors transform hover:scale-110"
          >
            {icons[key] || <Globe className="w-6 h-6" />}
          </a>
        );
      })}
    </div>
  );
}

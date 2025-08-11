import React from 'react';
import logo from '../assets/logo.png';
import { Heart, Code, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
  <footer className="relative bg-gray-900 text-white py-8 mt-auto shadow-2xl border-t border-gray-800 animate-fadeIn">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
  <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Brand Section with Logo */}
          <div className="flex items-center mb-6 md:mb-0 group gap-3">
            <img src={logo} alt="LinkSnap Logo" className="w-7 h-7 rounded-md shadow-md border border-gray-700 bg-white group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 animate-fadeIn" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent drop-shadow-md">
                LinkSnap
              </span>
              <span className="text-xs text-blue-300 opacity-80">Portfolio Project</span>
            </div>
          </div>

          {/* Links and Info */}
          <div className="flex flex-col md:flex-row items-center gap-8 text-center">
            <div className="flex gap-8 text-sm">
              <a href="#features" className="hover:text-cyan-300 transition-all duration-300 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#analytics" className="hover:text-cyan-300 transition-all duration-300 relative group">
                Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a 
                href="https://github.com/VanshAgrawal52" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-cyan-300 transition-all duration-300 relative group"
              >
                GitHub
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span>by</span>
              <span className="font-semibold text-white">Vansh Agrawal</span>
              <span>• © {currentYear}</span>
            </div>
          </div>
        </div>
        
        {/* Tech Stack */}
        <div className="border-t border-white/10 mt-6 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-300 mb-4 md:mb-0">
              <Code className="w-4 h-4" />
              <span>Built with React • Node.js • MongoDB • Tailwind CSS</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                System Online
              </span>
              <span>Portfolio Project #2</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

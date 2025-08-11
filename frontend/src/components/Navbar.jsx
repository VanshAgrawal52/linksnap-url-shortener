import React from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
  <nav className="relative overflow-hidden bg-white text-gray-900 shadow-2xl animate-fadeIn border-b border-gray-200">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
      
      <div className="relative z-10 flex justify-between items-center px-8 py-6">
        {/* Brand Section with Logo */}
        <a href="#" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
          <div className="relative">
            <img src={logo} alt="LinkSnap Logo" className="w-8 h-8 rounded-lg shadow-md border border-gray-200 bg-white group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 animate-fadeIn" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent drop-shadow-lg tracking-wide">
              LinkSnap
            </span>
            <span className="text-xs text-blue-200 font-medium opacity-80">
              URL Shortener
            </span>
          </div>
        </a>
        
  {/* Navigation Links */}
  <div className="flex items-center gap-8 animate-fadeIn">
          <ul className="hidden md:flex gap-8 text-lg font-medium">
            <li className="relative group">
              <span className="cursor-pointer hover:text-cyan-200 transition-all duration-300 relative">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </li>
            <li className="relative group">
              <span className="cursor-pointer hover:text-cyan-200 transition-all duration-300 relative">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </li>
            <li className="relative group">
              <span className="cursor-pointer hover:text-cyan-200 transition-all duration-300 relative">
                Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </span>
            </li>
            <li className="relative group">
              <a 
                href="https://github.com/VanshAgrawal52" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-cyan-200 transition-all duration-300 relative"
              >
                GitHub
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </li>
          </ul>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="hidden md:block px-6 py-2 text-sm font-medium text-white border border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              Sign In
            </button>
            <button className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

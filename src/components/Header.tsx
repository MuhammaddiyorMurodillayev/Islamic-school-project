import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('programs'), href: '/programs' },
    { name: t('admissions'), href: '/admissions' },
    { name: t('parentResources'), href: '/parent-resources' },
    { name: t('gallery'), href: '/gallery' },
    { name: t('news'), href: '/news' },
    { name: t('contact'), href: '/contact' },
  ];

  const languages = [
    {
      code: 'en',
      name: 'ENG',
      flag: '🇺🇸',
      fullName: 'English',
      bgStyle: 'linear-gradient(to bottom, #B22234 0%, #B22234 7.69%, #FFFFFF 7.69%, #FFFFFF 15.38%, #B22234 15.38%, #B22234 23.08%, #FFFFFF 23.08%, #FFFFFF 30.77%, #B22234 30.77%, #B22234 38.46%, #FFFFFF 38.46%, #FFFFFF 46.15%, #B22234 46.15%, #B22234 53.85%, #FFFFFF 53.85%, #FFFFFF 61.54%, #B22234 61.54%, #B22234 69.23%, #FFFFFF 69.23%, #FFFFFF 76.92%, #B22234 76.92%, #B22234 84.62%, #FFFFFF 84.62%, #FFFFFF 92.31%, #B22234 92.31%, #B22234 100%), radial-gradient(circle at 12.5% 25%, #3C3B6E 0%, #3C3B6E 40%, transparent 40%)',
      textColor: '#FFFFFF'
    },
    { 
      code: 'uz', 
      name: 'UZB', 
      flag: '🇺🇿',
      fullName: 'O\'zbekcha',
      bgStyle: 'linear-gradient(to bottom, #0099B5 0%, #0099B5 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #1EB53A 66.66%, #1EB53A 100%)',
      textColor: '#000000' 
    },
    { 
      code: 'ru', 
      name: 'RUS', 
      flag: '🇷🇺',
      fullName: 'Русский',
      bgStyle: 'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 33.33%, #0039A6 33.33%, #0039A6 66.66%, #D52B1E 66.66%, #D52B1E 100%)',
      textColor: '#000000'
    }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Increased size */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-4">
              <img
                src="https://i.postimg.cc/MTZZBBGX/Logo-Islamic-School-Al-quran.jpg"
                alt="Al-Quran Islamic School"
                className="h-20 w-20 object-contain rounded-lg shadow-md"
              />
              <div className="text-left">
                <h1 className="text-xl font-bold text-emerald-800 leading-tight">Al-Quran</h1>
                <p className="text-base text-emerald-600 leading-tight">Islamic School</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Fixed width container */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    location.pathname === item.href
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Toggle & CTA - Fixed width container */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as 'en' | 'uz' | 'ru')}
                  className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 transform hover:scale-110 group ${
                    language === lang.code
                      ? 'border-emerald-500 shadow-lg scale-110 ring-2 ring-emerald-200'
                      : 'border-gray-300 hover:border-emerald-400 shadow-md'
                  }`}
                  style={{
                    background: lang.bgStyle,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title={lang.fullName}
                >
                  <span 
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold drop-shadow-lg tracking-wide"
                    style={{ color: lang.textColor }}
                  >
                    {lang.name}
                  </span>
                  {language === lang.code && (
                    <div className="absolute inset-0 bg-emerald-500 bg-opacity-10 rounded-full"></div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {lang.fullName}
                  </div>
                </button>
              ))}
            </div>

            <Link
              to="/admissions"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 whitespace-nowrap"
            >
              {t('enrollNow')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="px-3 py-4 border-t border-gray-200 mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">Language / Til / Язык:</span>
                </div>
                <div className="flex justify-center space-x-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as 'en' | 'uz' | 'ru');
                        setIsMenuOpen(false);
                      }}
                      className={`relative w-16 h-16 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                        language === lang.code
                          ? 'border-emerald-500 shadow-lg scale-105 ring-2 ring-emerald-200'
                          : 'border-gray-300 hover:border-emerald-400 shadow-md'
                      }`}
                      style={{
                        background: lang.bgStyle,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      title={lang.fullName}
                    >
                      <span 
                        className="absolute inset-0 flex items-center justify-center text-xs font-bold drop-shadow-lg tracking-wide"
                        style={{ color: lang.textColor }}
                      >
                        {lang.name}
                      </span>
                      {language === lang.code && (
                        <div className="absolute inset-0 bg-emerald-500 bg-opacity-10 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <Link
                to="/admissions"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 mt-4 text-center bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition-colors duration-200"
              >
                {t('enrollNow')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
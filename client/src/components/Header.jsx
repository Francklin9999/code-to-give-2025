import React, { useRef, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Globe, ChevronDown, AlertTriangle, Heart, Menu, X, User, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import Avatar from "./ui/Avatar";
import GoogleTranslate from "./GoogleTranslate";
import ProfileDropdown from "./ProfileDropdown";

const languages = [
  { code: 'en', name: 'English', flag: '🇨🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'hy', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export default function Header() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const translateRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('googtrans='));
    if (cookie) {
      const langCode = cookie.split('=')[1].split('/')[2];
      if (langCode) {
        setSelectedLanguage(langCode);
      }
    }
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // hide header when scrolling down
      if (currentY > lastY && currentY > 50) {
        setHidden(true);
      } else {
        // show header when scrolling up
        setHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    setIsLanguageDropdownOpen(false);
    
    if (translateRef.current) {
      translateRef.current.changeLanguage(langCode);
    } else {
      document.cookie = `googtrans=/en/${langCode};path=/;max-age=31536000`;
      setTimeout(() => {
        if (translateRef.current?.isLoaded()) {
          translateRef.current.changeLanguage(langCode);
        } else {
          window.location.reload();
        }
      }, 500);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <>
      {/* Hidden Google Translate component */}
      <div style={{ display: 'none' }}>
        <GoogleTranslate ref={translateRef} />
      </div>
      <header
        className={`fixed top-0 left-0 right-0 z-50 shadow-sm bg-background border-b border-secondary/2 
                    transition-transform duration-300 ${hidden ? "-translate-y-20" : "translate-y-0"}`}
      >
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/landing" className="flex items-center gap-3 group min-w-0 flex-1 md:flex-none">
            <div className="relative flex-shrink-0">
              <img
                src="/logo.svg"
                alt="Shield of Athena"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm md:text-lg xl:text-xl bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent truncate">
                Shield of Athena
              </div>
              <div className="text-xs text-gray-600 font-medium hidden sm:block">
                Athena Paths
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            {/* Primary CTAs */}
            <Link
              to="/are-you-a-victim"
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:from-red-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              <AlertTriangle className="w-4 h-4" />
              Are you a victim?
            </Link>

            <Link
              to="/donate"
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-bold text-sm hover:from-primary-dark hover:to-secondary-dark transition-all shadow-md hover:shadow-lg"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>

            {/* Find Your Path */}
            <NavLink
              to="/find-your-path"
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              {t("nav.findPath")}
            </NavLink>

            {/* Our Services */}
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              {t("nav.services")}
            </NavLink>

            {/* Community dropdown */}
            <div className="relative group">
              <button className="nav-link inline-flex items-center gap-1 cursor-pointer -translate-y-[4.5%]">
                <span>Community</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150
                              absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 z-40"> 
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm ${
                      isActive ? "text-primary font-semibold" : "text-foreground/80"
                    } hover:bg-gray-50`
                  }
                >
                  Leaderboard
                </NavLink>

                <NavLink
                  to="/support-wall"
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm ${
                      isActive ? "text-primary font-semibold" : "text-foreground/80"
                    } hover:bg-gray-50`
                  }
                >
                  {t("nav.supportWall")}
                </NavLink>

                <NavLink
                  to="/news"
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm ${
                      isActive ? "text-primary font-semibold" : "text-foreground/80"
                    } hover:bg-gray-50`
                  }
                >
                  News
                </NavLink>
              </div>
            </div>

            {/* Contact */}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Language Selector with Google Translate */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-1 md:gap-2 text-foreground/80 hover:text-primary min-w-[80px] md:min-w-[120px] justify-between"
                title="Select language"
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-lg">{currentLanguage.flag}</span>
                  <span className="hidden lg:inline text-sm font-medium notranslate" translate="no">
                    {currentLanguage.name}
                  </span>
                  <span className="lg:hidden text-xs font-medium uppercase">{currentLanguage.code}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {isLanguageDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLanguageDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-56 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors ${
                            selectedLanguage === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <span className="flex-1 text-left notranslate" translate="no">
                            {lang.name}
                          </span>
                          {selectedLanguage === lang.code && (
                            <span className="text-indigo-600">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown - Desktop only */}
            <div className="hidden md:block">
              <ProfileDropdown />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="md:hidden fixed top-0 right-0 h-screen w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <img src="/logo.svg" alt="Shield of Athena" className="w-8 h-8" />
                  <div>
                    <div className="font-bold text-lg bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                      Shield of Athena
                    </div>
                    <div className="text-xs text-gray-600">Athena Paths</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* User Profile Section */}
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={user.avatar_url}
                      name={user.full_name}
                      size="lg"
                      alt={user.full_name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-primary font-medium">
                          {user.total_points} {t("common.points")}
                        </span>
                        {user.badges && user.badges.length > 0 && (
                          <span className="text-xs text-gray-500">
                            • {user.badges.length} {t("common.badges")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar 
                      size="lg"
                      fallbackIcon={User}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Guest
                      </p>
                      <p className="text-sm text-gray-600">
                        Not logged in
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Actions */}
              <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-base font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-gray-500" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      // Trigger login modal
                      window.dispatchEvent(new CustomEvent('open-login-modal'));
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-base font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <LogIn className="w-5 h-5 text-primary" />
                    Login
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-6 py-4 overflow-y-auto">
                <nav className="space-y-3 pb-4">
                  {/* Priority Actions */}
                  <Link
                    to="/are-you-a-victim"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-4 rounded-lg font-bold text-base hover:from-red-700 hover:to-orange-600 transition-all shadow-md"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    Are you a victim?
                  </Link>

                  <Link
                    to="/donate"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-lg font-bold text-base hover:from-primary-dark hover:to-secondary-dark transition-all shadow-md"
                  >
                    <Heart className="w-5 h-5" />
                    Donate
                  </Link>

                  {/* Divider */}
                  <div className="h-px bg-gray-200 my-6" />

                  {/* Regular Navigation */}
                  <NavLink
                    to="/find-your-path"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-6 py-4 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {t("nav.findPath")}
                  </NavLink>

                  <NavLink
                    to="/services"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-6 py-4 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {t("nav.services")}
                  </NavLink>

                  {/* Community Section */}
                  <div className="space-y-2">
                    <div className="px-6 py-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Community</h3>
                    </div>
                    <NavLink
                      to="/leaderboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-6 py-3 rounded-lg text-sm font-medium transition-colors ml-4 ${
                          isActive
                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >
                      Leaderboard
                    </NavLink>

                    <NavLink
                      to="/support-wall"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-6 py-3 rounded-lg text-sm font-medium transition-colors ml-4 ${
                          isActive
                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >
                      {t("nav.supportWall")}
                    </NavLink>

                    <NavLink
                      to="/news"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-6 py-3 rounded-lg text-sm font-medium transition-colors ml-4 ${
                          isActive
                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >
                      News
                    </NavLink>
                  </div>

                  <NavLink
                    to="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-6 py-4 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    Contact
                  </NavLink>
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
                <div className="text-xs text-gray-500 text-center">
                  © 2025 Shield of Athena
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
    </>
  );
}

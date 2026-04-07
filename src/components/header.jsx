import React, { useState, useEffect } from "react";
import { Search, User, Menu, X, Play, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/auth";

const Header = ({ onSearch, logoUrl }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-8 py-4 flex items-center justify-between ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-2xl py-3 border-b border-white/5"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center gap-10">
        <a href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-[#e50914] transition-all">
            {logoUrl ? (
              <img src={logoUrl} alt="LK21" className="h-6 w-auto" />
            ) : (
              <Play size={20} fill="#e50914" stroke="#e50914" />
            )}
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-white font-black text-xl tracking-tighter uppercase italic leading-none">
              LK21
            </span>
            <span className="text-[8px] font-bold text-[#e50914] tracking-widest uppercase text-center">
              OFFICIAL
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="/" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="/movies" className="hover:text-white transition-colors">
            Movies
          </a>
          <a href="/series" className="hover:text-white transition-colors">
            Series
          </a>
          <a href="/popular" className="hover:text-white transition-colors">
            Popular
          </a>
          <a href="/mylist" className="hover:text-white transition-colors">
            My List
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center relative">
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearchSubmit}
                className="relative flex items-center overflow-hidden"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres..."
                  className="bg-black/40 border border-white/20 rounded-full py-1 pl-10 pr-4 text-white text-xs focus:outline-none focus:border-white/40 w-full"
                  autoFocus
                />
                <Search className="absolute left-3 text-gray-400" size={14} />
              </motion.form>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white hover:text-gray-300 transition-colors ml-2"
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <button className="text-white hover:text-gray-300 transition-colors hidden md:block">
          <Bell size={20} />
        </button>

        {isAuthenticated ? (
          <div className="relative group flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-purple-600 border-2 border-white/20 overflow-hidden flex items-center justify-center cursor-pointer shadow-lg shadow-red-500/20">
              <span className="text-white text-xs font-bold uppercase">{user?.email?.charAt(0) || 'U'}</span>
            </div>
            
            <div className="absolute right-0 top-10 w-36 bg-[#0a0a0a] border border-white/10 rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto shadow-2xl z-50">
               <div className="px-4 py-2 border-b border-white/10 mb-1">
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Signed in as</p>
                 <p className="text-xs text-white truncate font-medium">{user?.email}</p>
               </div>
               <button onClick={logout} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                  Sign Out
               </button>
            </div>
          </div>
        ) : (
          <a href="/login" className="px-5 py-1.5 bg-[#e50914] hover:bg-red-700 text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-lg shadow-red-500/20 tracking-wide">
            Sign In
          </a>
        )}

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white hover:text-gray-300 transition-colors">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-black/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden lg:hidden flex flex-col px-6 shadow-2xl z-50 flex"
          >
            <nav className="flex flex-col py-6 gap-6 font-medium text-gray-300">
              <a href="/" className="hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Home
              </a>
              <a href="/category/movies" className="hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Movies
              </a>
              <a href="/category/tv" className="hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Series
              </a>
              <a href="/category/popular" className="hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Popular
              </a>
              <a href="/mylist" className="hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>
                My List
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

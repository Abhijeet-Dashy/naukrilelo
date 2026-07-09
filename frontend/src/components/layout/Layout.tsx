import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';
import { Button } from '../ui/Button';

const Layout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-primaryText">
      {/* Navbar */}
      <div className="sticky top-6 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <header className="pointer-events-auto mx-auto max-w-5xl flex h-14 items-center justify-between px-6 border border-border bg-surface/60 backdrop-blur-sm rounded-full shadow-lg shadow-black/40 relative">
          <div className="flex items-center space-x-6">
            <Link to="/" className="font-bold text-lg tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>Naukri Lelo</Link>
            <nav className="hidden md:flex space-x-6 text-sm font-medium text-secondaryText items-center">
              <Link to="/dashboard" className="hover:text-primaryText transition-colors duration-200">Dashboard</Link>
              <Link to="/revision" className="hover:text-primaryText transition-colors duration-200">Revision</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <a href="https://github.com/liquidslr/leetcode-company-wise-problems/" target="_blank" rel="noreferrer" className="hidden md:flex text-sm font-medium text-secondaryText hover:text-primaryText transition-colors items-center">
              <FiGithub className="mr-1.5" /> Source
            </a>
            {user ? (
              <div className="hidden sm:flex items-center space-x-4">
                <span className="text-sm font-medium">{user.name}</span>
                <Button variant="outline" size="sm" className="hover:bg-danger/20 hover:text-danger hover:border-danger rounded-full px-4" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-secondaryText hover:text-primaryText transition-colors">Login</Link>
                <Link to="/register">
                  <Button size="sm" className="rounded-full px-5">Sign Up</Button>
                </Link>
              </div>
            )}
            
            {/* Hamburger Menu Toggle */}
            <button 
              className="md:hidden flex items-center justify-center p-2 -mr-2 text-secondaryText hover:text-primaryText focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-surface/95 border border-border backdrop-blur-md rounded-2xl shadow-xl flex flex-col space-y-4 md:hidden">
              <nav className="flex flex-col space-y-4">
                <Link to="/dashboard" className="text-sm font-medium text-secondaryText hover:text-primaryText transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link to="/revision" className="text-sm font-medium text-secondaryText hover:text-primaryText transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Revision</Link>
                <a href="https://github.com/liquidslr/leetcode-company-wise-problems/" target="_blank" rel="noreferrer" className="text-sm font-medium text-secondaryText hover:text-primaryText transition-colors flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiGithub className="mr-1.5" /> Source
                </a>
              </nav>
              
              <div className="pt-4 border-t border-border flex flex-col space-y-4 sm:hidden">
                {user ? (
                  <div className="flex flex-col space-y-4">
                    <span className="text-sm font-medium text-primaryText">Signed in as {user.name}</span>
                    <Button variant="outline" size="sm" className="w-full justify-center hover:bg-danger/20 hover:text-danger hover:border-danger rounded-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout</Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" size="sm" className="w-full rounded-full">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button size="sm" className="w-full rounded-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Left Side */}
          <div className="flex flex-col items-start max-w-sm">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-transparent border border-secondaryText translate-x-1 translate-y-1"></div>
              <div className="relative bg-background border border-primaryText px-3 py-1">
                <span className="font-extrabold text-xl tracking-tight uppercase">Naukri Lelo</span>
              </div>
            </div>
            <p className="text-[10.5px] text-secondaryText font-mono uppercase leading-relaxed tracking-wider text-left">
              A structural philosophy for placement preparation.<br />Organized with intent, built for speed.
            </p>
          </div>

          {/* Right Side */}
          <div className="flex flex-col md:items-end w-full md:w-auto">
            <h4 className="text-[10px] font-bold text-primaryText tracking-[0.2em] mb-4 uppercase text-left md:text-right">Connect</h4>
            <div className="flex flex-wrap md:justify-end gap-3">
              <a href="https://github.com/Abhijeet-Dashy" target="_blank" rel="noreferrer" className="flex items-center space-x-2 border border-border bg-surface px-4 py-2 hover:bg-border transition-colors text-[11px] font-mono text-primaryText font-semibold tracking-wider">
                <FiGithub size={14} />
                <span>GITHUB</span>
              </a>
              <a href="https://www.linkedin.com/in/abhijeet-dashy/" target="_blank" rel="noreferrer" className="flex items-center space-x-2 border border-border bg-surface px-4 py-2 hover:bg-border transition-colors text-[11px] font-mono text-primaryText font-semibold tracking-wider">
                <FiLinkedin size={14} />
                <span>LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

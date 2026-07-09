import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { companyService } from '../services/companyService';
import { useDebounce } from '../hooks/useDebounce';
import { FiSearch, FiChevronRight } from 'react-icons/fi';

export default function Home() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await companyService.getCompanies({ search: debouncedSearch, limit: 470 });
        setCompanies(data.companies);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Master Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryText to-secondaryText">
            Placement Prep
          </span>
        </h1>
        <p className="text-xl text-secondaryText">
          Company-wise DSA problem tracker to help you ace your next technical interview.
          Fast, minimal, and analytics-driven.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <Button size="lg" onClick={() => searchInputRef.current?.focus()}>Explore Companies</Button>
          <Link to="/register">
            <Button variant="outline" size="lg">Start Tracking</Button>
          </Link>
        </div>
      </section>

      {/* Search and Companies Section */}
      <section className="w-full px-4">
        {/* Search Bar */}
        <div className="relative max-w-4xl mx-auto w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FiSearch className="text-secondaryText group-focus-within:text-primaryText transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            className="w-full bg-surface border border-border rounded-xl py-4 pl-12 pr-12 text-primaryText placeholder:text-[#555] focus:outline-none focus:border-primaryText/50 focus:ring-1 focus:ring-primaryText/50 transition-all text-[15px]"
            placeholder="Search companies... (Amazon, Google, Stripe)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center justify-center font-mono text-[10px] text-[#555] border border-[#333] bg-[#111] px-1.5 py-0.5 rounded w-5 h-5">
              /
            </kbd>
          </div>
        </div>

        {/* Separator / Header */}
        <div className="max-w-6xl mx-auto flex items-center space-x-4 pt-12 pb-6">
          <div className="text-[10px] font-mono tracking-[0.15em] text-[#555] uppercase font-semibold">
            {companies.length} COMPANIES
          </div>
        </div>

        {/* Grid */}
        {loading && companies.length === 0 ? (
          <div className="text-center text-secondaryText py-12">Loading companies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {companies.map((company) => (
              <Link key={company._id} to={`/company/${company.slug}`} className="group block outline-none">
                <div className="bg-surface border border-transparent rounded-[14px] p-4 flex items-center justify-between hover:bg-[#1a1a1c] hover:border-border/80 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    {/* Logo */}
                    <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      <img 
                        src={`https://logo.clearbit.com/${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} 
                        alt={company.name} 
                        className="w-full h-full object-contain p-1.5" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=ffffff&color=000000&font-size=0.4&bold=true`;
                        }} 
                      />
                    </div>
                    
                    {/* Details */}
                    <div>
                      <h3 className="text-[15px] font-bold text-[#e4e4e7] group-hover:text-white transition-colors tracking-tight">{company.name}</h3>
                      <div className="flex items-center mt-1 text-[11px] font-mono">
                        <span className="font-semibold text-[#a1a1aa] w-10 text-right">{company.totalProblems}</span>
                        <span className="text-[#52525b] ml-1.5 mr-4">problems</span>
                        
                        <div className="flex items-center space-x-3 text-[#a1a1aa]">
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mr-1.5"></span>{company.difficultyCount?.easy || 0}</span>
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#eab308] mr-1.5"></span>{company.difficultyCount?.medium || 0}</span>
                          <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mr-1.5"></span>{company.difficultyCount?.hard || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chevron */}
                  <div className="text-[#52525b] opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    <FiChevronRight size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

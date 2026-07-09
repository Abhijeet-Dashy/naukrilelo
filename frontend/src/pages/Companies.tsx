import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { FiSearch } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';
import { Badge } from '../components/ui/Badge';

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await companyService.getCompanies({ search: debouncedSearch, limit: 50 });
        setCompanies(data.companies);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchCompanies();
  }, [debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-secondaryText mt-1">Browse company-wise DSA problems.</p>
        </div>
        <div className="w-full md:w-72">
          <Input 
            icon={<FiSearch />}
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-secondaryText">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies.map((company) => (
            <Link key={company._id} to={`/company/${company.slug}`} className="group block">
              <Card className="h-full hover:border-primaryText/50 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="group-hover:text-accent transition-colors">
                    {company.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">{company.totalProblems} <span className="text-sm font-normal text-secondaryText">problems</span></div>
                  <div className="flex space-x-2">
                    <Badge variant="success">{company.difficultyCount?.easy || 0}</Badge>
                    <Badge variant="warning">{company.difficultyCount?.medium || 0}</Badge>
                    <Badge variant="danger">{company.difficultyCount?.hard || 0}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {companies.length === 0 && (
            <div className="col-span-full text-center py-12 text-secondaryText">
              No companies found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

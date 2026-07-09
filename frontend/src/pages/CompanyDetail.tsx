import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { problemService } from '../services/problemService';
import { progressService } from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { ProblemTable } from '../components/tables/ProblemTable';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { FiSearch } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';

export default function CompanyDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  
  const [company, setCompany] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchProgress = async () => {
    if (!user) return;
    try {
      const data = await progressService.getProgress();
      const map: Record<string, any> = {};
      data.forEach((p: any) => {
        if (p.problemId) {
          map[p.problemId._id] = { solved: p.solved, revision: p.revision };
        }
      });
      setUserProgress(map);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (slug) {
          const comp = await companyService.getCompanyBySlug(slug);
          setCompany(comp);
        }
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [slug]);

  useEffect(() => {
    const fetchProblems = async () => {
      if (!company) return;
      try {
        const res = await problemService.getProblems({ company: company.name, search: debouncedSearch, limit: 100 });
        setProblems(res.problems);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProblems();
  }, [company, debouncedSearch]);

  useEffect(() => {
    fetchProgress();
  }, [user]);

  if (!company) return <div className="p-8 text-secondaryText">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold tracking-tight">{company.name}</h1>
        <p className="text-secondaryText mt-2">{company.totalProblems} problems indexed</p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <Card className="bg-surface">
          <CardHeader className="p-3 md:p-6"><CardTitle className="text-xs md:text-sm text-secondaryText">Easy</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0"><div className="text-xl md:text-3xl font-bold text-success">{company.difficultyCount?.easy || 0}</div></CardContent>
        </Card>
        <Card className="bg-surface">
          <CardHeader className="p-3 md:p-6"><CardTitle className="text-xs md:text-sm text-secondaryText">Medium</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0"><div className="text-xl md:text-3xl font-bold text-warning">{company.difficultyCount?.medium || 0}</div></CardContent>
        </Card>
        <Card className="bg-surface">
          <CardHeader className="p-3 md:p-6"><CardTitle className="text-xs md:text-sm text-secondaryText">Hard</CardTitle></CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0"><div className="text-xl md:text-3xl font-bold text-danger">{company.difficultyCount?.hard || 0}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold">Problems</h2>
          <div className="w-full sm:w-80">
            <Input 
              icon={<FiSearch />}
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ProblemTable 
          problems={problems} 
          userProgress={userProgress} 
          onProgressUpdate={fetchProgress} 
        />
      </div>
    </div>
  );
}

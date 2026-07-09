import { useEffect, useState } from 'react';
import { progressService } from '../services/progressService';
import { companyService } from '../services/companyService';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FiCheckCircle, FiBookOpen, FiTarget } from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ solved: 0, revision: 0 });
  const [companyStats, setCompanyStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user) return;
      try {
        const [data, allCompaniesRes] = await Promise.all([
          progressService.getProgress(),
          companyService.getCompanies({ limit: 500 })
        ]);
        
        const allCompanies = allCompaniesRes.companies || [];
        const companySolvedCount: Record<string, number> = {};
        
        let solved = 0;
        let revision = 0;
        
        data.forEach((p: any) => {
          if (p.solved) {
            solved++;
            if (p.problemId && p.problemId.companies) {
              p.problemId.companies.forEach((c: string) => {
                companySolvedCount[c] = (companySolvedCount[c] || 0) + 1;
              });
            }
          }
          if (p.revision) revision++;
        });
        
        const calculatedStats = allCompanies.map((c: any) => {
          const count = companySolvedCount[c.name] || 0;
          return {
            name: c.name,
            total: c.totalProblems,
            solved: count,
            percentage: c.totalProblems ? Math.round((count / c.totalProblems) * 100) : 0
          };
        }).filter((c: any) => c.percentage > 0).sort((a: any, b: any) => b.percentage - a.percentage);
        
        setStats({ solved, revision });
        setCompanyStats(calculatedStats);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-secondaryText mt-1">Welcome back, {user?.name}. Here is your progress overview.</p>
      </div>

      {loading ? (
        <div className="text-secondaryText">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-surface border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-secondaryText">Problems Solved</CardTitle>
                <FiCheckCircle className="text-success w-4 h-4" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.solved}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-surface border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-secondaryText">Revision Queue</CardTitle>
                <FiBookOpen className="text-warning w-4 h-4" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{stats.revision}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center">
              <FiTarget className="mr-2 text-primaryText" /> Company Completion
            </h2>
            {companyStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyStats.map((c, idx) => (
                  <Card key={idx} className="bg-surface border-border overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold truncate" title={c.name}>{c.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-2xl font-bold text-accent">{c.percentage}%</div>
                        <div className="text-xs text-secondaryText font-mono">{c.solved} / {c.total}</div>
                      </div>
                      <div className="w-full bg-background rounded-full h-1.5 mt-2 overflow-hidden border border-border">
                        <div 
                          className="bg-primaryText h-1.5 rounded-full" 
                          style={{ width: `${c.percentage}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-secondaryText text-sm py-4 p-4 border border-border rounded-lg bg-surface">
                You haven't completed any problems linked to a specific company yet. Keep grinding!
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

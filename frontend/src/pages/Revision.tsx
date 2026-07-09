import { useEffect, useState } from 'react';
import { progressService } from '../services/progressService';
import { ProblemTable } from '../components/tables/ProblemTable';
import { useAuth } from '../context/AuthContext';

export default function Revision() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchRevisionQueue = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await progressService.getProgress();
      const map: Record<string, any> = {};
      const revProbs: any[] = [];
      
      data.forEach((p: any) => {
        if (p.problemId) {
          map[p.problemId._id] = { solved: p.solved, revision: p.revision };
          if (p.revision) {
            revProbs.push(p.problemId);
          }
        }
      });
      
      setUserProgress(map);
      setProblems(revProbs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRevisionQueue();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revision Queue</h1>
        <p className="text-secondaryText mt-1">Problems you marked for later review.</p>
      </div>

      {loading ? (
        <div className="text-secondaryText">Loading revision queue...</div>
      ) : (
        <ProblemTable 
          problems={problems} 
          userProgress={userProgress} 
          onProgressUpdate={fetchRevisionQueue} 
        />
      )}
    </div>
  );
}

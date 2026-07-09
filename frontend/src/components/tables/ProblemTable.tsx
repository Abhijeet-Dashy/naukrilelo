import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { progressService } from '../../services/progressService';
import { FiExternalLink } from 'react-icons/fi';

interface Problem {
  _id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  frequency: number;
  leetcodeUrl: string;
}

interface ProblemTableProps {
  problems: Problem[];
  userProgress?: Record<string, { solved: boolean, revision: boolean }>;
  onProgressUpdate?: () => void;
}

export function ProblemTable({ problems, userProgress = {}, onProgressUpdate }: ProblemTableProps) {
  const { user } = useAuth();

  const handleSolvedChange = async (problemId: string, currentVal: boolean) => {
    if (!user) return alert('Please login to track progress');
    try {
      await progressService.toggleSolved(problemId, !currentVal);
      if (onProgressUpdate) onProgressUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevisionChange = async (problemId: string, currentVal: boolean) => {
    if (!user) return alert('Please login to track progress');
    try {
      await progressService.toggleRevision(problemId, !currentVal);
      if (onProgressUpdate) onProgressUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm text-primaryText">
        <thead className="bg-surface border-b border-border text-secondaryText">
          <tr>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Difficulty</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Topics</th>
            <th className="px-4 py-3 font-medium text-right">Revise</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {problems.map((prob) => {
            const isSolved = userProgress[prob._id]?.solved || false;
            const isRevision = userProgress[prob._id]?.revision || false;
            return (
              <tr key={prob._id} className="hover:bg-surface/50 transition-colors">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={isSolved}
                    onChange={() => handleSolvedChange(prob._id, isSolved)}
                    className="w-4 h-4 rounded border-border bg-background focus:ring-primaryText text-primaryText"
                  />
                </td>
                <td className="px-4 py-3 font-medium font-mono text-[13.5px]">
                  <a href={prob.leetcodeUrl} target="_blank" rel="noreferrer" className={`flex items-center transition-colors ${isSolved ? 'text-secondaryText hover:text-primaryText' : 'hover:text-accent'}`}>
                    <span className={isSolved ? 'line-through opacity-50' : ''}>{prob.title}</span> 
                    <FiExternalLink className="ml-2 shrink-0 w-3 h-3 opacity-50" />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={prob.difficulty === 'Easy' ? 'success' : prob.difficulty === 'Medium' ? 'warning' : 'danger'}>
                    {prob.difficulty}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell max-w-[200px] truncate">
                  <span className="text-secondaryText text-xs">{(prob.topics || []).join(', ')}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <input 
                    type="checkbox" 
                    checked={isRevision}
                    onChange={() => handleRevisionChange(prob._id, isRevision)}
                    className="w-4 h-4 rounded border-border bg-background focus:ring-warning text-warning"
                  />
                </td>
              </tr>
            );
          })}
          {problems.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-secondaryText">
                No problems found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

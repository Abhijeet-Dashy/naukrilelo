import fs from 'fs';
import path from 'path';

const REPO_DIR = path.join(__dirname, '../../tmp_data');
const OUTPUT_FILE = path.join(__dirname, 'seedData.json');

// Regex to match CSV values with quotes
const CSV_SPLIT_REGEX = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

interface Problem {
  title: string;
  difficulty: string;
  topics: string[];
  companies: string[];
  frequency: number;
  leetcodeUrl: string;
  acceptanceRate: number;
}

const main = async () => {
  console.log('Starting data aggregation...');
  const problemsMap = new Map<string, Problem>();
  
  if (!fs.existsSync(REPO_DIR)) {
    console.error(`Repo directory not found at ${REPO_DIR}`);
    return;
  }

  const companies = fs.readdirSync(REPO_DIR).filter(item => {
    return fs.statSync(path.join(REPO_DIR, item)).isDirectory() && !item.startsWith('.');
  });

  console.log(`Found ${companies.length} companies to process.`);

  let processedCount = 0;

  for (const company of companies) {
    const allCsvPath = path.join(REPO_DIR, company, '5. All.csv');
    if (!fs.existsSync(allCsvPath)) {
      continue;
    }

    const fileContent = fs.readFileSync(allCsvPath, 'utf8');
    const lines = fileContent.split('\n');

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(CSV_SPLIT_REGEX);
      if (parts.length < 5) continue;

      const difficulty = parts[0] ? (parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase()) : 'Medium';
      const title = parts[1] || 'Unknown';
      const frequency = parseFloat(parts[2]) || 0;
      const acceptanceRate = parseFloat(parts[3]) || 0;
      const url = parts[4] || '';
      
      let topicsStr = parts[5] || '';
      if (topicsStr.startsWith('"') && topicsStr.endsWith('"')) {
        topicsStr = topicsStr.slice(1, -1);
      }
      const topics = topicsStr.split(',').map(t => t.trim()).filter(t => t);

      if (!problemsMap.has(title)) {
        problemsMap.set(title, {
          title,
          difficulty,
          topics,
          companies: [company],
          frequency,
          leetcodeUrl: url,
          acceptanceRate
        });
      } else {
        const existing = problemsMap.get(title)!;
        if (!existing.companies.includes(company)) {
          existing.companies.push(company);
        }
        // Update frequency as an average or max? Max is better for representation
        if (frequency > existing.frequency) {
          existing.frequency = frequency;
        }
      }
    }

    processedCount++;
    if (processedCount % 50 === 0) {
      console.log(`Processed ${processedCount}/${companies.length} companies...`);
    }
  }

  const allProblems = Array.from(problemsMap.values());
  // Sort by frequency descending
  allProblems.sort((a, b) => b.frequency - a.frequency);

  console.log(`Total unique problems collected: ${allProblems.length}`);
  
  // To avoid huge file size, maybe limit to top 1500 or just save all
  // The user asked for "all the data", so we save all.
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProblems, null, 2));
  console.log(`Successfully wrote ${allProblems.length} problems to ${OUTPUT_FILE}`);
};

main().catch(console.error);

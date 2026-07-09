import { fetchGithubData } from '../utils/githubHelper';
import { Company } from '../models/Company';
import { Problem } from '../models/Problem';
import { generateSlug } from '../utils/slugGenerator';
import { logger } from '../utils/logger';

export const runImportTask = async () => {
  logger.info('Starting GitHub data import...');
  const url = process.env.GITHUB_DATA_URL;
  if (!url) {
    throw new Error('GITHUB_DATA_URL is not defined in the environment variables');
  }

  let rawData: any;
  try {
    rawData = await fetchGithubData(url);
  } catch (error) {
    logger.warn('Failed to fetch data from GitHub. Falling back to local seed data...');
    // Fallback to local seed data
    const fs = require('fs');
    const path = require('path');
    const seedPath = path.join(__dirname, 'seedData.json');
    rawData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  }

  // Handle generic data format: array of problems or objects
  const problems = Array.isArray(rawData) ? rawData : (rawData.problems || []);
  
  if (!problems.length) {
    logger.warn('No problems found in the fetched data.');
    return { status: 'failed', message: 'No data to import' };
  }

  const companiesMap = new Map<string, any>();

  // Process Problems
  for (const item of problems) {
    const title = item.title || 'Unknown Problem';
    const slug = generateSlug(title);
    const difficulty = ['Easy', 'Medium', 'Hard'].includes(item.difficulty) ? item.difficulty : 'Medium';
    const companies = Array.isArray(item.companies) ? item.companies : [];
    
    // Save Problem
    await Problem.findOneAndUpdate(
      { slug },
      {
        $set: {
          title,
          slug,
          difficulty,
          topics: Array.isArray(item.topics) ? item.topics : [],
          companies,
          frequency: item.frequency || 0,
          leetcodeUrl: item.leetcodeUrl || `https://leetcode.com/problems/${slug}`,
          isPremium: !!item.isPremium,
          acceptanceRate: item.acceptanceRate || 0,
        }
      },
      { upsert: true, new: true }
    );

    // Aggregate Companies
    for (const companyName of companies) {
      if (!companyName) continue;
      
      const compSlug = generateSlug(companyName);
      if (!companiesMap.has(compSlug)) {
        companiesMap.set(compSlug, {
          name: companyName,
          slug: compSlug,
          totalProblems: 0,
          difficultyCount: { easy: 0, medium: 0, hard: 0 }
        });
      }

      const compData = companiesMap.get(compSlug);
      compData.totalProblems += 1;
      if (difficulty === 'Easy') compData.difficultyCount.easy += 1;
      if (difficulty === 'Medium') compData.difficultyCount.medium += 1;
      if (difficulty === 'Hard') compData.difficultyCount.hard += 1;
    }
  }

  // Process Companies
  for (const [slug, compData] of companiesMap.entries()) {
    await Company.findOneAndUpdate(
      { slug },
      { $set: compData },
      { upsert: true, new: true }
    );
  }

  const summary = {
    totalProblemsProcessed: problems.length,
    totalCompaniesProcessed: companiesMap.size,
  };

  logger.info(`Import completed: ${summary.totalProblemsProcessed} problems, ${summary.totalCompaniesProcessed} companies.`);
  return summary;
};

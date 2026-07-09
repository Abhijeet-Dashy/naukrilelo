import axios from 'axios';
import { AppError } from './AppError';

export const fetchGithubData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    throw new AppError(`Failed to fetch data from GitHub: ${error.message}`, 500);
  }
};

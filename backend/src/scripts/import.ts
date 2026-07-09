import dotenv from 'dotenv';
import connectDB from '../db/connection';
import { runImportTask } from './importLogic';
import mongoose from 'mongoose';

dotenv.config();

const startImport = async () => {
  await connectDB();
  try {
    await runImportTask();
    console.log('Import successful.');
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

startImport();

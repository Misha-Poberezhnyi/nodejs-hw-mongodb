import fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';

import { UPLOAD_FILES_PATH } from '../controllers/path.js';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';

export const saveFileLocal = async (file) => {
  try {
    if (!file || !file.filename || !file.path) {
      throw createHttpError(400, 'Invalid file object');
    }

    const newPath = path.join(UPLOAD_FILES_PATH, file.filename);

    await fs.rename(file.path, newPath);

    const fileUrl = `${getEnvVar(ENV_VARS.BACKEND_DOMAIN)}/uploads/${file.filename}`;

    return fileUrl;
  } catch (err) {
    console.error('Error saving file locally:', err);
    throw createHttpError(500, 'Failed to save file to local');
  }
};

import fs from 'fs';
import { TEMP_FILES_DIR_PATH, UPLOAD_FILES_PATH } from "./path.js"

export const ensureDirectoriesExist = () => {
    [TEMP_FILES_DIR_PATH, UPLOAD_FILES_PATH].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created missing directory:${dir}`)

        }
    });
};
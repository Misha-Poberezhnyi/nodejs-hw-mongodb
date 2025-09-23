import createHttpError from "http-errors";
import { ENV_VARS } from "../constants/envVars.js"
import { getEnvVar } from "./getEnvVar.js"
import { saveFileLocal } from "./saveFileLocal.js";
import { saveFileToCloudinary } from "./saveFileToCloudinary.js";

const saveFileStrategyMapper = {
    cloudinary: saveFileToCloudinary,
    local: saveFileLocal,
}

export const saveFile = async (file) => {
    const strategyName = getEnvVar(ENV_VARS.FILE_STORAGE_STRATEGY);
    const saveFileStrategy = saveFileStrategyMapper[strategyName];

    if (!saveFileStrategy) {
        throw createHttpError(500, `No strategy with name ${strategyName} provided`)
    }

    return await saveFileStrategy(file);
};
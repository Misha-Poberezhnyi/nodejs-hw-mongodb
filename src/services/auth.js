import bcrypt from "bcrypt";
import Handlebars from "handlebars";
import fs from 'node:fs';
import jwt from 'jsonwebtoken';
import path from 'node:path'
import { randomBytes } from 'crypto';
import { UsersCollection } from "../db/models/user.js"
import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";
import { sendMail } from "../utils/sendEmail.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { ENV_VARS } from "../constants/envVars.js";
import { TEMPLATE_DIR_PATH } from "../controllers/path.js";

const resetPasswordTemplate = fs.readFileSync(
    path.join(TEMPLATE_DIR_PATH, "send-reset-email-password.html"),)
    .toString();


export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if(user)throw createHttpError(409, 'Email in use')

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload, password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    };

    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    };

    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
};

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionsCollection.findOne({
        _id: sessionId,
        refreshToken,
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();

    await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

    return await SessionsCollection.create({
        userId: session.userId,
        ...newSession,
    });
};


export const logoutUser = async (sessionId, refreshToken) => {
    return await SessionsCollection.deleteOne({
        _id: sessionId,
        refreshToken,
    });
};

export const sendResetPasswordEmail = async (email) => {
    const user = await UsersCollection.findOne({ email });

    if (!user) {
        throw createHttpError(404,'User not found!')
    }

    const host = getEnvVar(ENV_VARS.FRONTEND_DOMAIN);
    const token = jwt.sign({
        sub: user._id,
        email: user.email,
    }, getEnvVar(ENV_VARS.JWT_SECRET), {
        expiresIn: '5m',
    });

    const resetPasswordLink = `${host}/reset-password?token=${token}`

    const template = Handlebars.compile(resetPasswordTemplate);

    const html = template({
        name: user.name,
        link: resetPasswordLink,
    })

    await sendMail({
        to: email,
        subject: 'Reset your pasword!',
        html,
    })
};

export const resetPassword = async (token, newPassword) => {
    let payload;

    try {
        payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
    } catch (err) {
        console.log(err);
        throw createHttpError(401, 'Token is expired or invalid.');
    };

    const user = await UsersCollection.findById(payload.sub);

    if (!user) {
        throw createHttpError(404, 'User not found!')
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    await SessionsCollection.deleteMany({ userId: user._id });
}
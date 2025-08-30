import { Router } from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema } from "../validation/auth.js";
import {ctrlWrapper} from "../utils/ctrlWrapper.js"
import { loginUserController, logoutUserController, refreshUserSessionController, registerUserController, resetPasswordController, sendResetPasswordEmailController } from "../controllers/auth.js";
import { sendResetPasswordEmailShema } from "../validation/sendResetPassword.js";
import { resetPasswordEmailShema } from "../validation/resetPassword.js";

const router = Router();

router.post('/register', validateBody(registerUserSchema),ctrlWrapper(registerUserController));
router.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/send-reset-password-email',validateBody(sendResetPasswordEmailShema), sendResetPasswordEmailController)
router.post('/reset-password',validateBody(resetPasswordEmailShema),resetPasswordController);


export default router;
// import { Router } from 'express';
// import { ctrlWrapper } from '../utils/ctrlWrapper.js';
// import {
//   loginUserSchema,
//   loginWithGoogleOAuthSchema,
//   registerUserSchema,
//   requestResetEmailSchema,
//   resetPasswordSchema,
// } from '../validation/auth.js';
// import {
//   getGoogleOAuthUrlController,
//   loginUserController,
//   loginWithGoogleController,
//   logoutUserController,
//   refreshUserSessionController,
//   registerUserController,
//   requestResetEmailController,
//   resetPasswordController,
// } from '../controllers/auth.js';
// import { validateBody } from '../middlewares/validateBody.js';

// const router = Router();

// router.post(
//   '/register',
//   validateBody(registerUserSchema),
//   ctrlWrapper(registerUserController),
// );

// router.post(
//   '/login',
//   validateBody(loginUserSchema),
//   ctrlWrapper(loginUserController),
// );

// router.post('/logout', ctrlWrapper(logoutUserController));

// router.post('/refresh', ctrlWrapper(refreshUserSessionController));

// router.post(
//   '/send-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );

// router.post(
//   '/reset-pwd',
//   validateBody(resetPasswordSchema),
//   ctrlWrapper(resetPasswordController),
// );

// router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

// router.post(
//   '/confirm-oauth',
//   validateBody(loginWithGoogleOAuthSchema),
//   ctrlWrapper(loginWithGoogleController),
// );

// export default router;

import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;

import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';
import { logoutUser } from '../services/auth.js';
import { refreshUsersSession } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const { user, session } = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      token: session.accessToken,
      user,
    },
  });
};

export const loginUserController = async (req, res) => {
  console.log('loginUserController started');
  const { user, session } = await loginUser(req.body);
  console.log('Session:', session);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      token: session.accessToken,
      user,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    sameSite: 'None',
    secure: true,
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
    sameSite: 'None',
    secure: true,
  });
};

export const refreshUserSessionController = async (req, res) => {
  const { user, session } = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      token: session.accessToken,
      user,
    },
  });
};

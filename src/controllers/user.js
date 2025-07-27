import createHttpError from 'http-errors';
import { updateUserPhoto } from '../services/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { SessionsCollection } from '../db/models/session.js';

export const updateUserPhotoController = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const session = await SessionsCollection.findOne({ _id: sessionId });
  const userId = session.userId;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const user = await updateUserPhoto(userId, photoUrl);

  if (!user) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully update user photo!`,
    data: user,
  });
};

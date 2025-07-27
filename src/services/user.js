import { UsersCollection } from '../db/models/user.js';

export const updateUserPhoto = async (userId, photoUrl) => {
  const user = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { photo: photoUrl },
    { new: true },
  );

  if (!user) return null;

  return user;
};

import process from 'node:process';
import { Buffer } from 'node:buffer';
import argon2 from 'argon2';
import {
  type User,
  deleteUserSchema,
  loginSchema,
  newUserSchema,
  updateUserSchema,
  verifyUserSchema,
} from '@/schema/user';
import {
  addUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  verifyUser,
} from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { sendVerificationEmail } from '@/utils/email';
import { handleError, handleValidationError } from '@/utils/errors';
import generateToken from '@/utils/jwt';

export const handleUserLogin = createHandler(loginSchema, async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (!user)
    return handleValidationError(req, res, 'User not Found');

  const matchPassword = await argon2.verify(user.password, password, {
    salt: Buffer.from(user.salt, 'hex'),
  });
  if (!matchPassword)
    return handleValidationError(req, res, 'Invalid Password');

  const token = generateToken(user.id);
  res.status(200).json({ data: token, message: 'Successfully Login!' });
});

export const handleAddUser = createHandler(newUserSchema, async (req, res) => {
  const user = req.body;
  const existingUser = await getUserByEmail(user.email);

  if (existingUser) {
    return handleValidationError(req, res, 'User Already Exist');
  }

  const userData = await addUser(user);
  if (!userData) {
    return handleError(req, res);
  }

  const { data, code } = userData;
  const status = await sendVerificationEmail(
    process.env.API_BASE_URL,
    data.name,
    data.email,
    code,
  );

  if (status !== 200) {
    await deleteUser(data.email);
    return handleValidationError(req, res, 'User not Found');
  }

  res.status(201).json({ data, message: 'Successfully Added!' });
});

export const handleVerifyUser = createHandler(verifyUserSchema, async (req, res) => {
  const { email, code } = req.query;
  const user = await getUserByEmail(email);
  if (!user) {
    return handleValidationError(req, res, 'User not Found');
  }
  const response = await verifyUser(email, code, user.code);
  if (!response) {
    return handleError(req, res);
  }
  res.status(200).send({ data: response, message: 'Successfully Verifed!' });
});

export const handleDeleteUser = createHandler(deleteUserSchema, async (req, res) => {
  const { email } = req.body;
  const { user } = res.locals as { user: User };

  if (user.email !== email && !user.isAdmin) {
    return handleError(req, res);
  }
  const userData = await getUserByEmail(email);

  if (!userData) {
    return handleValidationError(req, res, 'User not Found');
  }
  const deletedUser = await deleteUser(email);
  if (!deletedUser) {
    return handleError(req, res);
  }
  res.status(200).json({ data: deletedUser, message: 'Successfully Deleted!' });
});

export const handleGetUser = createHandler(async (_req, res) => {
  const { user } = res.locals as { user: User };

  res.status(200).json(
    { data:
    {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    }, message: 'Successfully Deleted!' },
  );
});

export const handleUpdateUser = createHandler(updateUserSchema, async (req, res) => {
  const { user } = res.locals as { user: User };
  const { name, password, email } = req.body;
  const userData = await getUserByEmail(email || '');
  if (!userData) {
    return handleValidationError(req, res, 'User not Found');
  }
  const updatedUser = await updateUser(user, { name, password, email });
  res.status(200).json({ data: updatedUser, message: 'Successfully Updated!' });
});

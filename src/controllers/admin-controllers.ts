import {
  deleteAllUnverifiedUsers,
  getAllUsers,
  getAllVerifiedUsers,
} from '@/services/admin-services';
import { createHandler } from '@/utils/create';

export const handleGetAllVerifiedUsers = createHandler(async (_req, res) => {
  const users = await getAllVerifiedUsers();
  res.status(200).json({
    data: users,
  });
});

export const handleGetAllUsers = createHandler(async (_req, res) => {
  const users = await getAllUsers();
  res.status(200).json({
    data: users,
  });
});

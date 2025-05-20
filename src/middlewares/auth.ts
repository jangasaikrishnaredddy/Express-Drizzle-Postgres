import { getUserByUserId } from '@/services/user-services';
import { createHandler } from '@/utils/create';
import { handleError, handleUnauthorized, handleValidationError } from '@/utils/errors';
import { verifyToken } from '@/utils/jwt';

export function authenticate({ verifyAdmin } = {
  verifyAdmin: false,
}) {
  return createHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return handleUnauthorized(req, res);
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return handleUnauthorized(req, res);
    }

    const verifyTokenData = verifyToken(token);
    if (!verifyTokenData) {
      return handleUnauthorized(req, res);
    }
    const { userId } = verifyTokenData;

    const user = await getUserByUserId(userId);

    if (!user)
      return handleUnauthorized(req, res);

    if (verifyAdmin && !user.isAdmin) {
      return handleUnauthorized(req, res);
    }

    res.locals.user = user;
    next();
  });
}

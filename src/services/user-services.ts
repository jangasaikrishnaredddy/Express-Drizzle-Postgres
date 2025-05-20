import process from 'node:process';
import crypto from 'node:crypto';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { type NewUser, type UpdateUser, type User, users } from '@/schema/user';
import { db } from '@/utils/db';
import { sendVerificationEmail } from '@/utils/email';
import { sha256 } from '@/utils/hash';

export async function getUserByUserId(userId: string) {
  const user = db.query.users.findFirst();
  return user;
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({  where: (users, { eq }) => eq(users.email, email)});   
  return user;
}

export async function addUser(user: NewUser) {
  const { password, ...userDetails } = user;

  const salt = crypto.randomBytes(32);
  const code = crypto.randomBytes(32).toString('hex');
  const hashedPassword = await argon2.hash(password, {
    salt,
  });

  const [newUser] = await db
    .insert(users)
    .values({
      ...userDetails,
      password: hashedPassword,
      salt: salt.toString('hex'),
      code,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      code: users.code,
      isVerified: users.isVerified,
      isAdmin: users.isAdmin,
    });

  if (!newUser) {
    return null;
  }

  return { data: newUser, code };
}

export async function verifyUser(email: string, code: string, existingCode: string) {
  const isVerified = sha256.verify(code, existingCode);
  if (!isVerified) {
    return null;
  }
  const [updatedUser] = await db
    .update(users)
    .set({ isVerified })
    .where(eq(users.email, email))
    .returning({ id: users.id });

  if (!updatedUser) {
    return null;
  }
  return updatedUser;
}

export async function deleteUser(email: string) {
  const [deletedUser] = await db.delete(users).where(eq(users.email, email)).returning({
    id: users.id,
    name: users.name,
    email: users.email,
  });

  if (!deletedUser) {
    return null;
  }
  return deletedUser;
}

export async function updateUser(user: User, { name, email, password }: UpdateUser) {
  let code: string | undefined;
  let hashedCode: string | undefined;
  if (email) {
    code = crypto.randomBytes(32).toString('hex');
    hashedCode = sha256.hash(code);
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      name,
      password,
      email,
      code: hashedCode,
      isVerified: hashedCode ? false : user.isVerified,
    })
    .where(eq(users.email, user.email))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      isAdmin: users.isAdmin,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    });

  if (!updatedUser) {
    return null;
  }
  return updatedUser;
}

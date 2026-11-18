import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { ValidationError, Unauthenticated } from "../../errors/AppError";
import { signUpSchema, signInSchema } from "./auth.schema";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não configurado no .env");
}

export interface JwtPayload {
  userId: string;
}

export function signToken(userId: string): string {
  return jwt.sign({ userId } satisfies JwtPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function signUp(input: unknown) {
  const data = signUpSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw ValidationError("E-mail já cadastrado");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  return { token: signToken(user.id), user };
}

export async function signIn(input: unknown) {
  const data = signInSchema.parse(input);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw Unauthenticated("E-mail ou senha inválidos");
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    throw Unauthenticated("E-mail ou senha inválidos");
  }

  return { token: signToken(user.id), user };
}

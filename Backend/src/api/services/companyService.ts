// import { PrismaClient } from '@prisma/client';
// import { CreateCompanyInput } from '../validators/companyValidator';
// import { redisClient } from '../utils/redis';

// const prisma = new PrismaClient();

// export const createCompany = async (input: CreateCompanyInput, userId: number) => {
// const company = await prisma.company.create({
// data: {
// ...input,
// userId,
// },
// });

// // Invalidate cache
// await redisClient.del(`company:${userId}`);
// return company;
// };

// export const getCompanyByUserId = async (userId: number) => {
// const cacheKey = `company:${userId}`;
// const cachedCompany = await redisClient.get(cacheKey);
// if (cachedCompany) {
// return JSON.parse(cachedCompany);
// }

// const company = await prisma.company.findFirst({
// where: { userId },
// });

// if (company) {
// await redisClient.set(cacheKey, JSON.stringify(company), { EX: 3600 }); // Cache for 1 hour
// }
// return company;
// };


import { prisma } from '../../lib/prisma';
import { CreateCompanyInput } from '../validators/companyValidator';
import { redisClient } from '../utils/redis';

export const createCompany = async (input: CreateCompanyInput, userId: number) => {
  // First, make sure the user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found. Cannot create company without a valid user.');
  }

  const company = await prisma.company.create({
    data: {
      ...input,
      userId,
    },
  });

  // Invalidate cache
  await redisClient.del(`company:${userId}`);
  return company;
};

export const getCompanyByUserId = async (userId: number) => {
  const cacheKey = `company:${userId}`;
  const cachedCompany = await redisClient.get(cacheKey);
  if (cachedCompany) {
    return JSON.parse(cachedCompany);
  }

  const company = await prisma.company.findFirst({
    where: { userId },
  });

  if (company) {
    await redisClient.set(cacheKey, JSON.stringify(company), { EX: 3600 }); // Cache for 1 hour
  }
  return company;
};
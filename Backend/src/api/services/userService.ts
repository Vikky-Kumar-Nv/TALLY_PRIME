import { prisma } from '../../lib/prisma';

export const updateUserPassword = async (userId: number, newPassword: string): Promise<void> => {
  // No need to manually hash password, Prisma middleware will handle it
  await prisma.user.update({
    where: { id: userId },
    data: { 
      password: newPassword,
      updatedAt: new Date()
    }
  });
};

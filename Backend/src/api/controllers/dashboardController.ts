import { Request, Response } from 'express';
import { getCompanyByUserId } from '../services/companyService';
import { prisma } from '../../lib/prisma';
import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';

export const getDashboardDataHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Fetch company
    const company = await getCompanyByUserId(userId);
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    // Fetch ledgers and vouchers with caching
    const ledgersCacheKey = `ledgers:${company.id}`;
    const vouchersCacheKey = `vouchers:${company.id}`;

    let ledgers = await redisClient.get(ledgersCacheKey);
    let vouchers = await redisClient.get(vouchersCacheKey);

    if (!ledgers) {
      ledgers = JSON.stringify(await prisma.ledger.findMany({ where: { companyId: company.id } }));
      await redisClient.set(ledgersCacheKey, ledgers, { EX: 3600 });
    }

    if (!vouchers) {
      vouchers = JSON.stringify(await prisma.voucher.findMany({ where: { companyId: company.id } }));
      await redisClient.set(vouchersCacheKey, vouchers, { EX: 3600 });
    }

    res.status(200).json({
      companyInfo: company,
      ledgers: JSON.parse(ledgers),
      vouchers: JSON.parse(vouchers),
    });
  } catch (error: any) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
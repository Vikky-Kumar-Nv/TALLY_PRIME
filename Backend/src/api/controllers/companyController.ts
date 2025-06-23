import { Request, Response } from 'express';
import { createCompanySchema } from '../validators/companyValidator';
import { createCompany } from '../services/companyService';
import { logger } from '../utils/logger';

export const createCompanyHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createCompanySchema.parse(req.body);
    const userId = (req as any).user.id;
    const company = await createCompany(validatedData, userId);
    res.status(201).json(company);
  } catch (error: any) {
    logger.error('Error creating company:', error);
    res.status(400).json({ message: error.message });
  }
};


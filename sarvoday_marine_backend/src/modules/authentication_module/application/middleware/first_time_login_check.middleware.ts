import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../domain/models/user.model';

export const checkFirstLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isFirstLogin) {
      return res.status(200).json({ message: 'First login, please change your password', isFirstLogin: true });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

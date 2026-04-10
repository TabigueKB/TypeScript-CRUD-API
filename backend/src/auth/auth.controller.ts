import { Request, Response, NextFunction, Router } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { validateRequest } from '../_middleware/validateRequest';
import { db } from '../_helpers/db';

const router = Router();
router.post('/login', loginSchema, login);
router.post('/register', registerSchema, register);
export default router;

function login(req: Request, res: Response, next: NextFunction): void {
  const { email, password } = req.body;
  db.Account.scope('withHash').findOne({ where: { email } })
    .then(async (account: any) => {
      if (!account) throw 'Invalid email or password';
      if (!account.verified) throw 'Account not verified. Please verify your email first.';
      const valid = await bcrypt.compare(password, account.passwordHash);
      if (!valid) throw 'Invalid email or password';
      const { passwordHash, ...rest } = account.toJSON();
      res.json({ ...rest, message: 'Login successful' });
    }).catch(next);
}

function register(req: Request, res: Response, next: NextFunction): void {
  const { password, ...rest } = req.body;
  db.Account.findOne({ where: { email: rest.email } })
    .then(async (existing: any) => {
      if (existing) throw `Email "${rest.email}" is already registered`;
      const passwordHash = await bcrypt.hash(password, 10);
      return db.Account.create({ ...rest, passwordHash, role: 'User', verified: false });
    })
    .then((account: any) => res.json({ id: account.id, message: 'Registration successful. Please verify your email.' }))
    .catch(next);
}

function loginSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() }));
}
function registerSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({
    firstname: Joi.string().required(), lastname: Joi.string().required(),
    email: Joi.string().email().required(), password: Joi.string().min(6).required(),
  }));
}

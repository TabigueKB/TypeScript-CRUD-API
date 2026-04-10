import { Request, Response, NextFunction, Router } from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { validateRequest } from '../_middleware/validateRequest';
import { db } from '../_helpers/db';

const router = Router();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/:id/verify', verifyAccount);
export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
  db.Account.findAll().then((a: any) => res.json(a)).catch(next);
}
function getById(req: Request, res: Response, next: NextFunction): void {
  db.Account.findByPk(req.params.id)
    .then((a: any) => { if (!a) throw 'Account not found'; res.json(a); }).catch(next);
}
function create(req: Request, res: Response, next: NextFunction): void {
  const { password, ...rest } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => db.Account.create({ ...rest, passwordHash: hash }))
    .then(() => res.json({ message: 'Account created' })).catch(next);
}
function update(req: Request, res: Response, next: NextFunction): void {
  const { password, ...rest } = req.body;
  const updateData: any = { ...rest };
  const doUpdate = (hash?: string) => {
    if (hash) updateData.passwordHash = hash;
    db.Account.scope('withHash').findByPk(req.params.id)
      .then((a: any) => { if (!a) throw 'Account not found'; return a.update(updateData); })
      .then(() => res.json({ message: 'Account updated' })).catch(next);
  };
  if (password) bcrypt.hash(password, 10).then((h: string) => doUpdate(h));
  else doUpdate();
}
function _delete(req: Request, res: Response, next: NextFunction): void {
  db.Account.findByPk(req.params.id)
    .then((a: any) => { if (!a) throw 'Account not found'; return a.destroy(); })
    .then(() => res.json({ message: 'Account deleted' })).catch(next);
}
function verifyAccount(req: Request, res: Response, next: NextFunction): void {
  db.Account.findByPk(req.params.id)
    .then((a: any) => { if (!a) throw 'Account not found'; return a.update({ verified: true }); })
    .then(() => res.json({ message: 'Account verified' })).catch(next);
}
function createSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({
    firstname: Joi.string().required(), lastname: Joi.string().required(),
    email: Joi.string().email().required(), password: Joi.string().min(6).required(),
    role: Joi.string().valid('Admin', 'User').default('User'), verified: Joi.boolean().default(false),
  }));
}
function updateSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({
    firstname: Joi.string().empty(''), lastname: Joi.string().empty(''),
    email: Joi.string().email().empty(''), password: Joi.string().min(6).empty(''),
    role: Joi.string().valid('Admin', 'User').empty(''), verified: Joi.boolean(),
  }));
}

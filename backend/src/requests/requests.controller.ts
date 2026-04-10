import { Request, Response, NextFunction, Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { db } from '../_helpers/db';

const router = Router();
router.get('/', getAll);
router.get('/my/:email', getByEmail);
router.post('/', createSchema, create);
router.put('/:id/approve', approve);
router.put('/:id/reject', reject);
router.delete('/:id', _delete);
export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
  db.Request.findAll().then((r: any) => res.json(r)).catch(next);
}
function getByEmail(req: Request, res: Response, next: NextFunction): void {
  db.Request.findAll({ where: { employeeEmail: req.params.email } })
    .then((r: any) => res.json(r)).catch(next);
}
function create(req: Request, res: Response, next: NextFunction): void {
  const data = { ...req.body, items: JSON.stringify(req.body.items), date: new Date().toLocaleDateString(), status: 'Pending' };
  db.Request.create(data).then((r: any) => res.json(r)).catch(next);
}
function approve(req: Request, res: Response, next: NextFunction): void {
  db.Request.findByPk(req.params.id)
    .then((r: any) => { if (!r) throw 'Request not found'; return r.update({ status: 'Approved' }); })
    .then((r: any) => res.json(r)).catch(next);
}
function reject(req: Request, res: Response, next: NextFunction): void {
  db.Request.findByPk(req.params.id)
    .then((r: any) => { if (!r) throw 'Request not found'; return r.update({ status: 'Rejected' }); })
    .then((r: any) => res.json(r)).catch(next);
}
function _delete(req: Request, res: Response, next: NextFunction): void {
  db.Request.findByPk(req.params.id)
    .then((r: any) => { if (!r) throw 'Request not found'; return r.destroy(); })
    .then(() => res.json({ message: 'Request deleted' })).catch(next);
}
function createSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({
    type: Joi.string().valid('Equipment', 'Leave', 'Resources').required(),
    items: Joi.array().items(Joi.object({ name: Joi.string().required(), qty: Joi.number().min(1).required() })).min(1).required(),
    employeeEmail: Joi.string().email().required(),
  }));
}

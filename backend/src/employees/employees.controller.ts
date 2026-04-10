import { Request, Response, NextFunction, Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { db } from '../_helpers/db';

const router = Router();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
  db.Employee.findAll().then((e: any) => res.json(e)).catch(next);
}
function getById(req: Request, res: Response, next: NextFunction): void {
  db.Employee.findByPk(req.params.id)
    .then((e: any) => { if (!e) throw 'Employee not found'; res.json(e); }).catch(next);
}
function create(req: Request, res: Response, next: NextFunction): void {
  db.Employee.create(req.body).then((e: any) => res.json(e)).catch(next);
}
function update(req: Request, res: Response, next: NextFunction): void {
  db.Employee.findByPk(req.params.id)
    .then((e: any) => { if (!e) throw 'Employee not found'; return e.update(req.body); })
    .then((e: any) => res.json(e)).catch(next);
}
function _delete(req: Request, res: Response, next: NextFunction): void {
  db.Employee.findByPk(req.params.id)
    .then((e: any) => { if (!e) throw 'Employee not found'; return e.destroy(); })
    .then(() => res.json({ message: 'Employee deleted' })).catch(next);
}
function createSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({
    empId: Joi.string().required(), name: Joi.string().required(),
    email: Joi.string().email().required(), position: Joi.string().required(),
    department: Joi.string().required(), hireDate: Joi.string().required(),
  }));
}
function updateSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({
    empId: Joi.string().empty(''), name: Joi.string().empty(''),
    email: Joi.string().email().empty(''), position: Joi.string().empty(''),
    department: Joi.string().empty(''), hireDate: Joi.string().empty(''),
  }));
}

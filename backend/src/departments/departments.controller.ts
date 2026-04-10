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
  db.Department.findAll().then((d: any) => res.json(d)).catch(next);
}
function getById(req: Request, res: Response, next: NextFunction): void {
  db.Department.findByPk(req.params.id)
    .then((d: any) => { if (!d) throw 'Department not found'; res.json(d); }).catch(next);
}
function create(req: Request, res: Response, next: NextFunction): void {
  db.Department.create(req.body).then((d: any) => res.json(d)).catch(next);
}
function update(req: Request, res: Response, next: NextFunction): void {
  db.Department.findByPk(req.params.id)
    .then((d: any) => { if (!d) throw 'Department not found'; return d.update(req.body); })
    .then((d: any) => res.json(d)).catch(next);
}
function _delete(req: Request, res: Response, next: NextFunction): void {
  db.Department.findByPk(req.params.id)
    .then((d: any) => { if (!d) throw 'Department not found'; return d.destroy(); })
    .then(() => res.json({ message: 'Department deleted' })).catch(next);
}
function createSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({ name: Joi.string().required(), description: Joi.string().empty('').default('') }));
}
function updateSchema(req: Request, res: Response, next: NextFunction): void {
  validateRequest(req, next, Joi.object({ name: Joi.string().empty(''), description: Joi.string().allow('') }));
}

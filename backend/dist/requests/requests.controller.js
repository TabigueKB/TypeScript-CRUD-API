"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const validateRequest_1 = require("../_middleware/validateRequest");
const db_1 = require("../_helpers/db");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/my/:email', getByEmail);
router.post('/', createSchema, create);
router.put('/:id/approve', approve);
router.put('/:id/reject', reject);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    db_1.db.Request.findAll().then((r) => res.json(r)).catch(next);
}
function getByEmail(req, res, next) {
    db_1.db.Request.findAll({ where: { employeeEmail: req.params.email } })
        .then((r) => res.json(r)).catch(next);
}
function create(req, res, next) {
    const data = { ...req.body, items: JSON.stringify(req.body.items), date: new Date().toLocaleDateString(), status: 'Pending' };
    db_1.db.Request.create(data).then((r) => res.json(r)).catch(next);
}
function approve(req, res, next) {
    db_1.db.Request.findByPk(req.params.id)
        .then((r) => { if (!r)
        throw 'Request not found'; return r.update({ status: 'Approved' }); })
        .then((r) => res.json(r)).catch(next);
}
function reject(req, res, next) {
    db_1.db.Request.findByPk(req.params.id)
        .then((r) => { if (!r)
        throw 'Request not found'; return r.update({ status: 'Rejected' }); })
        .then((r) => res.json(r)).catch(next);
}
function _delete(req, res, next) {
    db_1.db.Request.findByPk(req.params.id)
        .then((r) => { if (!r)
        throw 'Request not found'; return r.destroy(); })
        .then(() => res.json({ message: 'Request deleted' })).catch(next);
}
function createSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({
        type: joi_1.default.string().valid('Equipment', 'Leave', 'Resources').required(),
        items: joi_1.default.array().items(joi_1.default.object({ name: joi_1.default.string().required(), qty: joi_1.default.number().min(1).required() })).min(1).required(),
        employeeEmail: joi_1.default.string().email().required(),
    }));
}

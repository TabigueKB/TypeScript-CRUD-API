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
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
exports.default = router;
function getAll(req, res, next) {
    db_1.db.Employee.findAll().then((e) => res.json(e)).catch(next);
}
function getById(req, res, next) {
    db_1.db.Employee.findByPk(req.params.id)
        .then((e) => { if (!e)
        throw 'Employee not found'; res.json(e); }).catch(next);
}
function create(req, res, next) {
    db_1.db.Employee.create(req.body).then((e) => res.json(e)).catch(next);
}
function update(req, res, next) {
    db_1.db.Employee.findByPk(req.params.id)
        .then((e) => { if (!e)
        throw 'Employee not found'; return e.update(req.body); })
        .then((e) => res.json(e)).catch(next);
}
function _delete(req, res, next) {
    db_1.db.Employee.findByPk(req.params.id)
        .then((e) => { if (!e)
        throw 'Employee not found'; return e.destroy(); })
        .then(() => res.json({ message: 'Employee deleted' })).catch(next);
}
function createSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({
        empId: joi_1.default.string().required(), name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(), position: joi_1.default.string().required(),
        department: joi_1.default.string().required(), hireDate: joi_1.default.string().required(),
    }));
}
function updateSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({
        empId: joi_1.default.string().empty(''), name: joi_1.default.string().empty(''),
        email: joi_1.default.string().email().empty(''), position: joi_1.default.string().empty(''),
        department: joi_1.default.string().empty(''), hireDate: joi_1.default.string().empty(''),
    }));
}

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
    db_1.db.Department.findAll().then((d) => res.json(d)).catch(next);
}
function getById(req, res, next) {
    db_1.db.Department.findByPk(req.params.id)
        .then((d) => { if (!d)
        throw 'Department not found'; res.json(d); }).catch(next);
}
function create(req, res, next) {
    db_1.db.Department.create(req.body).then((d) => res.json(d)).catch(next);
}
function update(req, res, next) {
    db_1.db.Department.findByPk(req.params.id)
        .then((d) => { if (!d)
        throw 'Department not found'; return d.update(req.body); })
        .then((d) => res.json(d)).catch(next);
}
function _delete(req, res, next) {
    db_1.db.Department.findByPk(req.params.id)
        .then((d) => { if (!d)
        throw 'Department not found'; return d.destroy(); })
        .then(() => res.json({ message: 'Department deleted' })).catch(next);
}
function createSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({ name: joi_1.default.string().required(), description: joi_1.default.string().empty('').default('') }));
}
function updateSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({ name: joi_1.default.string().empty(''), description: joi_1.default.string().allow('') }));
}

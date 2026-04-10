"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validateRequest_1 = require("../_middleware/validateRequest");
const db_1 = require("../_helpers/db");
const router = (0, express_1.Router)();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.post('/:id/verify', verifyAccount);
exports.default = router;
function getAll(req, res, next) {
    db_1.db.Account.findAll().then((a) => res.json(a)).catch(next);
}
function getById(req, res, next) {
    db_1.db.Account.findByPk(req.params.id)
        .then((a) => { if (!a)
        throw 'Account not found'; res.json(a); }).catch(next);
}
function create(req, res, next) {
    const { password, ...rest } = req.body;
    bcryptjs_1.default.hash(password, 10)
        .then((hash) => db_1.db.Account.create({ ...rest, passwordHash: hash }))
        .then(() => res.json({ message: 'Account created' })).catch(next);
}
function update(req, res, next) {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };
    const doUpdate = (hash) => {
        if (hash)
            updateData.passwordHash = hash;
        db_1.db.Account.scope('withHash').findByPk(req.params.id)
            .then((a) => { if (!a)
            throw 'Account not found'; return a.update(updateData); })
            .then(() => res.json({ message: 'Account updated' })).catch(next);
    };
    if (password)
        bcryptjs_1.default.hash(password, 10).then((h) => doUpdate(h));
    else
        doUpdate();
}
function _delete(req, res, next) {
    db_1.db.Account.findByPk(req.params.id)
        .then((a) => { if (!a)
        throw 'Account not found'; return a.destroy(); })
        .then(() => res.json({ message: 'Account deleted' })).catch(next);
}
function verifyAccount(req, res, next) {
    db_1.db.Account.findByPk(req.params.id)
        .then((a) => { if (!a)
        throw 'Account not found'; return a.update({ verified: true }); })
        .then(() => res.json({ message: 'Account verified' })).catch(next);
}
function createSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({
        firstname: joi_1.default.string().required(), lastname: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(), password: joi_1.default.string().min(6).required(),
        role: joi_1.default.string().valid('Admin', 'User').default('User'), verified: joi_1.default.boolean().default(false),
    }));
}
function updateSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({
        firstname: joi_1.default.string().empty(''), lastname: joi_1.default.string().empty(''),
        email: joi_1.default.string().email().empty(''), password: joi_1.default.string().min(6).empty(''),
        role: joi_1.default.string().valid('Admin', 'User').empty(''), verified: joi_1.default.boolean(),
    }));
}

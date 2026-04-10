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
router.post('/login', loginSchema, login);
router.post('/register', registerSchema, register);
exports.default = router;
function login(req, res, next) {
    const { email, password } = req.body;
    db_1.db.Account.scope('withHash').findOne({ where: { email } })
        .then(async (account) => {
        if (!account)
            throw 'Invalid email or password';
        if (!account.verified)
            throw 'Account not verified. Please verify your email first.';
        const valid = await bcryptjs_1.default.compare(password, account.passwordHash);
        if (!valid)
            throw 'Invalid email or password';
        const { passwordHash, ...rest } = account.toJSON();
        res.json({ ...rest, message: 'Login successful' });
    }).catch(next);
}
function register(req, res, next) {
    const { password, ...rest } = req.body;
    db_1.db.Account.findOne({ where: { email: rest.email } })
        .then(async (existing) => {
        if (existing)
            throw `Email "${rest.email}" is already registered`;
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        return db_1.db.Account.create({ ...rest, passwordHash, role: 'User', verified: false });
    })
        .then((account) => res.json({ id: account.id, message: 'Registration successful. Please verify your email.' }))
        .catch(next);
}
function loginSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({ email: joi_1.default.string().email().required(), password: joi_1.default.string().required() }));
}
function registerSchema(req, res, next) {
    (0, validateRequest_1.validateRequest)(req, next, joi_1.default.object({
        firstname: joi_1.default.string().required(), lastname: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(), password: joi_1.default.string().min(6).required(),
    }));
}

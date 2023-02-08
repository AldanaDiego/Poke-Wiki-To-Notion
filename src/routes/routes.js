const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const MovesController = require('../controllers/moves.controller.js');
const AbilitiesController = require('../controllers/abilities.controller.js');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).send({errors: errors});
    } else {
        next();
    }
}

router.post(
    '/move',
    [
        body('name').notEmpty().withMessage('name is required')
    ],
    validate,
    MovesController.sendMoveToNotion
);

router.post(
    '/ability',
    [
        body('name').notEmpty().withMessage('name is required')
    ],
    validate,
    AbilitiesController.sendAbilityToNotion
);

module.exports = router
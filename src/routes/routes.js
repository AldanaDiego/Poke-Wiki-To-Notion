const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');

const MovesController = require('../controllers/moves.controller.js');
const AbilitiesController = require('../controllers/abilities.controller.js');
const MovesetsController = require('../controllers/movesets.controller.js');

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

router.get(
    '/moveset/:pokemon/:dexNumber',
    [
        param('pokemon').notEmpty().withMessage('pokemon name is required (moveset/:pokemon/:dexNumber)'),
        param('dexNumber').notEmpty().withMessage('pokemon dex number is required (moveset/:pokemon/:dexNumber)')
    ],
    validate,
    MovesetsController.getMoveset
);

module.exports = router
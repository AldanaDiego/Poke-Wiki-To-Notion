const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MovesController = require('../controllers/moves.controller.js');

router.post(
    '/move',
    [
        body('name').notEmpty().withMessage('name is required')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({errors: errors});
        } else {
            next();
        }
    },
    MovesController.sendMoveToNotion
);

module.exports = router
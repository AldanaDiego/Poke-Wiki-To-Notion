
const MovesService = require('../services/moves.service');

const sendMoveToNotion = (req, res) => {
    MovesService.getMoveInfo(req.body.name).then(moveInfo => {
        if (moveInfo !== null && moveInfo !== undefined) {
            res.send(moveInfo);
        } else {
            res.status(500).send("Some error ocurred");
        }
    });
};

module.exports = {
    sendMoveToNotion
}
const MovesetsService = require('../services/movesets.service');

const getMoveset = (req, res) => {
    MovesetsService.getMoveset(req.params.pokemon, req.params.dexNumber).then(movesetInfo => {
        if (movesetInfo !== null && movesetInfo !== undefined) {
            res.send(movesetInfo);
        } else {
            res.status(500).send("Some error ocurred while retrieving moveset info");
        }
    });
};

module.exports = {
    getMoveset
};
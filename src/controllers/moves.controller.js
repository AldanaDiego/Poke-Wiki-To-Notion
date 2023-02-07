const MovesService = require('../services/moves.service');
const NotionService = require('../services/notion.service.js');

const sendMoveToNotion = (req, res) => {
    MovesService.getMoveInfo(req.body.name).then(moveInfo => {
        if (moveInfo !== null && moveInfo !== undefined) {
            NotionService.addMove(moveInfo).then(notionResponse => {
                if (notionResponse !== null && notionResponse !== undefined) {
                    res.send(moveInfo);
                } else {
                    res.status(500).send("Some error ocurred while sending info to Notion");        
                }
            });
        } else {
            res.status(500).send("Some error ocurred while retrieving move info");
        }
    });
};

module.exports = {
    sendMoveToNotion
}
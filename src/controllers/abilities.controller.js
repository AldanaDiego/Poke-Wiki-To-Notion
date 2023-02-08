const AbilitiesService = require('../services/abilities.service');
const NotionService = require('../services/notion.service.js');

const sendAbilityToNotion = (req, res) => {
    AbilitiesService.getAbilityInfo(req.body.name).then(abilityInfo => {
        if (abilityInfo !== null && abilityInfo !== undefined) {
            NotionService.addAbility(abilityInfo).then(notionResponse => {
                if (notionResponse !== null && notionResponse !== undefined) {
                    res.send(abilityInfo);
                } else {
                    res.status(500).send("Some error ocurred while sending info to Notion");        
                }
            });
        } else {
            res.status(500).send("Some error ocurred while retrieving ability info");
        }
    });
};

module.exports = {
    sendAbilityToNotion
}
const { Client } = require('@notionhq/client');
const Notion = new Client({ auth: process.env.NOTION_TOKEN });

async function addMove(moveInfo) {
    return Notion.pages.create({
        parent: { type: "database_id", database_id: process.env.NOTION_MOVE_DB },
        properties: {
            Move: { title: [{ text: { content: moveInfo.Name } }] },
            Type: { select: { name: moveInfo.Type } },
            Category: { select: { name: moveInfo.Category } },
            Power: { rich_text: [{ text: { content: moveInfo.Power } }] },
            Accuracy: { rich_text: [{ text: { content: moveInfo.Accuracy } }] },
            PP: { rich_text: [{ text: { content: moveInfo.PP } }] },
            Generation: { rich_text: [{ text: { content: moveInfo.Generation } }] },
            Effect: { rich_text: [{ text: { content: moveInfo.Effect } }] }
        }
    }).then(resp => {
        return resp;
    }).catch(err => {
        console.log("Exception while sending move info to Notion: " + err.message | "undefined error");
        return null;
    });
}

async function addAbility(abilityInfo)
{
    return Notion.pages.create({
        parent: { type: "database_id", database_id: process.env.NOTION_ABILITY_DB },
        properties: {
            Ability: { title: [{ text: { content: abilityInfo.Name } }] },
            'Original Effect': { rich_text: [{ text: { content: abilityInfo.Effect } }] },
            Generation: { rich_text: [{ text: { content: abilityInfo.Generation } }] },
        }
    }).then(resp => {
        return resp;
    }).catch(err => {
        console.log("Exception while sending ability info to Notion: " + err.message | "undefined error");
        return null;
    });
}

module.exports = {
    addMove,
    addAbility
}
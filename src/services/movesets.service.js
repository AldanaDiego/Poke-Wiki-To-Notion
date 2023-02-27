const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios').default;

async function getMoveset(pokemon, dexNumber) {
    var movesetUrl = process.env.SEREBII_WIKI_URL + '/pokedex-sv/' + pokemon;
    return axios.get(movesetUrl).then(resp => {
        if (resp.status == 200 && resp.data !== null && resp.data !== undefined) {
            var moveset = [];
            try {
                const dom = new JSDOM(resp.data).window.document;
                const tables = dom.querySelectorAll("table");
                tables.forEach(table => {
                    const tableTitle = table.querySelector("h3")?.textContent.trim();
                    if (isTableTitleMoveset(tableTitle)) {
                        const moves = table.querySelectorAll("a[href^='/attackdex']");
                        moves.forEach(move => {
                            moveset.push(move.textContent.trim());
                        })
                        
                    }
                });
                return moveset;

            } catch (err) {
                console.log("Exception while parsing moveset info " + err.message);
                return null;
            }
        } else {
            console.log("Status code when getting moveset info: " + resp.status);
            return null;
        }
    }).catch(err => {
        console.log('HUH' + err.message);
        console.log("Exception while getting moveset info: " + err.message | "undefined error");
        return null;
    });
};

function isTableTitleMoveset(tableTitle) {
    if (tableTitle !== null && tableTitle !== undefined && (tableTitle.includes("Level Up") || tableTitle.includes("Attacks") || tableTitle.includes("Moves"))) {
        return true;
    }
    return false;
}

module.exports = {
    getMoveset
};
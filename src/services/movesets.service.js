const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios').default;

async function getMoveset(pokemon, dexNumber) {
    var movesetUrl = process.env.SEREBII_WIKI_URL + '/pokedex-sv/' + pokemon;
    return axios.get(movesetUrl).then(resp => {
        if (resp.status == 200 && resp.data !== null && resp.data !== undefined) {
            var moveset = {};
            try {
                const dom = new JSDOM(resp.data).window.document;
                const tables = dom.querySelectorAll("table");
                tables.forEach(table => {
                    const tableTitle = table.querySelector("h3")?.textContent.trim();
                    const learningMethod = parseTableTitle(tableTitle);
                    if (learningMethod !== null) {
                        const moves = table.querySelectorAll("a[href^='/attackdex']");
                        moves.forEach(move => {
                            moveName = move.textContent.trim();
                            if (moveset[moveName] === undefined) {
                                moveset[moveName] = {};
                            }
                            if (moveset[moveName][learningMethod] === undefined) {
                                moveset[moveName][learningMethod] = [];
                            }
                            if (!moveset[moveName][learningMethod].includes("IX")) {
                                moveset[moveName][learningMethod].push("IX");
                            }
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
        console.log("Exception while getting moveset info: " + err.message | "undefined error");
        return null;
    });
};

function parseTableTitle(tableTitle) {
    if (tableTitle !== null && tableTitle !== undefined) {
        if (tableTitle.includes("Level Up")) {
            return "Level Up";
        } else if (tableTitle.includes("Machine") || tableTitle.includes("Record") || tableTitle.includes("TM") ) {
            return "TM";
        } else if (tableTitle.includes("Egg")) {
            return "Breeding";
        } else if (tableTitle.includes("Tutor")) {
            return "Tutor";
        } else if (tableTitle.includes("Special")) {
            return "Special Move";
        } else if (tableTitle.includes("Transfer")) {
            return "Transfer";
        } else if (tableTitle.includes("Pre-Evolution")) {
            return "Pre-Evolution";
        }
    }
    return null;
}

module.exports = {
    getMoveset
};
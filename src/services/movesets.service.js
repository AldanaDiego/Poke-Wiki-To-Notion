const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios').default;

const generationUrl = {
    "I": "/pokedex/",
    "II": "/pokedex-gs/",
    "III": "/pokedex-rs/",
    "IV": "/pokedex-dp/",
    "V": "/pokedex-bw/",
    "VI": "/pokedex-xy/",
    "VII": "/pokedex-sm/",
    "VIII": "/pokedex-swsh/",
    "IX": "/pokedex-sv/",
};

async function getMoveset(pokemon, dexNumber) {
    var generationMovesets = []
    for (var generation in generationUrl) {
        generationMovesets.push(getGenerationMoveset(pokemon, dexNumber, generation));
    }
    return Promise.all(generationMovesets).then(results => {
        var mergedMoveset = {}
        results.forEach(result => {
            if (result != null) {
                var generation = result['generation'];
                var moveset = result['moveset'];
                
                for (var moveName in moveset) {
                    var learningMethods = moveset[moveName];
                    if (mergedMoveset[moveName] === undefined) {
                        mergedMoveset[moveName] = {};
                    }
                    learningMethods.forEach(learningMethod => {
                        if (mergedMoveset[moveName][learningMethod] === undefined) {
                            mergedMoveset[moveName][learningMethod] = [];
                        }
                        mergedMoveset[moveName][learningMethod].push(generation);
                    });
                } 
            }
        });
        
        return mergedMoveset;
    });
};

async function getGenerationMoveset(pokemon, dexNumber, generation) {
    var movesetUrl = process.env.SEREBII_WIKI_URL + generationUrl[generation] + ((generation == "VIII" || generation == "IX") ? pokemon : (dexNumber + ".shtml"));
    return axios.get(movesetUrl).then(resp => {
        if (resp.status == 200 && resp.data !== null && resp.data !== undefined) {
            try {
                var moveset = {};
                const dom = new JSDOM(resp.data).window.document;
                const tables = dom.querySelectorAll("table.dextable");
                tables.forEach(table => {
                    const tableTitle = table.querySelector("tr")?.textContent.trim();
                    const learningMethod = parseTableTitle(tableTitle);
                    if (learningMethod !== null) {
                        const moves = table.querySelectorAll("a[href^='/attackdex']");
                        moves.forEach(move => {
                            moveName = move.textContent.trim();
                            if (moveset[moveName] === undefined) {
                                moveset[moveName] = [];
                            }
                            if (!moveset[moveName].includes(learningMethod)) {
                                moveset[moveName].push(learningMethod);
                            }
                        });
                    }
                });
                
                return { generation: generation, moveset: moveset };
            } catch (err) {
                console.log("Exception while parsing moveset info " + err.message);
                return null;
            }
        } else {
            console.log("Status code when getting moveset (Gen " + generation +") info: " + resp.status);
            return null;
        }
    }).catch(err => {
        console.log("Exception while getting moveset info: " + err.message | "undefined error");
        return null;
    });
}

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
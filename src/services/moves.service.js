const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios').default;
const moveWikiUrl = 'http://bulbapedia.bulbagarden.net/wiki/';

async function getMoveInfo(moveName) {
    var moveUrl = moveWikiUrl + moveName.replace(' ', '_') + '_(move)';
    return axios.get(moveUrl).then(resp => {
        if (resp.status == 200 && resp.data !== null && resp.data !== undefined) {
            var moveInfo = {
                Name: moveName
            };
            const fieldsToSearch = [
                'Type',
                'Category',
                'Power',
                'PP',
                'Accuracy'
            ];

            try {
                const dom = new JSDOM(resp.data).window.document;
                const tables = dom.querySelector("table").querySelectorAll("table");

                const battleDataTable = tables[0];
                battleDataTable.querySelectorAll("tr").forEach(tr => {
                    const field = tr.querySelector("th")?.textContent.trim();
                    if (fieldsToSearch.includes(field)) {
                        var value = tr.querySelector("td").textContent.trim();
                        if (value.indexOf(' ') !== -1) {
                            value = value.slice(0, value.indexOf(' '));
                        }
                        moveInfo[field] = value;
                    }
                });

                const availabilityTable = tables[2];
                availabilityTable.querySelectorAll("tr").forEach(tr => {
                    const field = tr.querySelector("th")?.textContent.trim();
                    if (field === 'Introduced') {
                        var value = tr.querySelector("td").textContent.trim();
                        value = value.slice(value.indexOf(' '));
                        moveInfo.Generation = value;
                    }
                });

                dom.querySelectorAll("h2").forEach(h2 => {
                    if (h2.textContent === "Description") {
                        const descriptions = h2.nextElementSibling.querySelectorAll("tr");
                        for (let i = descriptions.length - 1; i > 0; i--) {
                            const description = descriptions[i].querySelectorAll("td")[1].textContent;
                            console.log(description);
                            if (description.includes("This move can't be used")) {
                                continue;
                            }
                            moveInfo.Effect = description.replace('.\n', '');
                            break;
                        }
                    }
                })

                return moveInfo;
            } catch (err) {
                console.log("Exception while parsing move info " + err.message);
                return null;
            }
        } else {
            console.log("Status code when getting move info: " + resp.status);
            return null;
        }
    }).catch(err => {
        console.log("Exception while getting move info: " + err.message | "undefined error");
        return null;
    });
}

module.exports = {
    getMoveInfo
};
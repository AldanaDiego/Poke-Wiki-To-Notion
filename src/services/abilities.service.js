const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios').default;

async function getAbilityInfo(abilityName) {
    var abilityUrl = process.env.BULBAPEDIA_WIKI_URL + abilityName.replace(' ', '_') + '_(Ability)';
    return axios.get(abilityUrl).then(resp => {
        if (resp.status == 200 && resp.data !== null && resp.data !== undefined) {
            var abilityInfo = {
                Name: abilityName
            };

            try {
                const dom = new JSDOM(resp.data).window.document;
                const descriptions = dom.querySelector("table").querySelectorAll("table");
                const effectRow = descriptions[descriptions.length - 1].querySelectorAll("td");

                abilityInfo.Generation = descriptions[0].querySelector("th").textContent.trim();
                abilityInfo.Generation = abilityInfo.Generation.slice(abilityInfo.Generation.indexOf(' '));
                abilityInfo.Effect = effectRow[effectRow.length - 1].textContent.trim().replace('.\n', '');

                return abilityInfo;
            } catch (err) {
                console.log("Exception while parsing ability info " + err.message);
                return null;
            }
        } else {
            console.log("Status code when getting ability info: " + resp.status);
            return null;
        }
    }).catch(err => {
        console.log("Exception while getting ability info: " + err.message | "undefined error");
        return null;
    });
}

module.exports = {
    getAbilityInfo
}
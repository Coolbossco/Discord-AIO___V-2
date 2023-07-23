const fs = require('fs');
const ms = require('ms');
const config = require('../config.json');

module.exports = async (client) => {
    setInterval(() => {
        let warns;
        try {
            warns = require('../warns.json');
        } catch (err) {
            warns = {};
            fs.writeFileSync('../warns.json', '{}');
        }

        for (const userId in warns) {
            if (warns[userId] >= 3) {
                const member = client.guilds.cache.first().members.cache.get(userId);
                if (!member) continue;
                const muteRole = member.guild.roles.cache.find(role => role.name === 'Muted');
                if (!muteRole) continue;

                member.roles.add(muteRole);

                setTimeout(() => {
                    member.roles.remove(muteRole);
                }, ms('1h'));

                warns[userId] = 0;
            }
        }

        fs.writeFile('../warns.json', JSON.stringify(warns), err => {
            if (err) {
                console.error(err);
            }
        });
    }, ms('2m'));
};

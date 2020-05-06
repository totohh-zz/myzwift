const fs = require('fs');
const ZwiftAccount = require('./account');

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: node index <username> <password>');
} else {
    const account = new ZwiftAccount(args[0], args[1]);
    account.getMe().then(profile => {
        fs.writeFileSync('data.json', JSON.stringify(profile, null, 2), err => {
            if (err) {
                console.log(`FS Error: ${e.getMessage()}`);
            }
            console.log('Data written to file');
        });
        console.log(profile.activities.map(activity => activity.notableMoments.filter(notableMoment => notableMoment.achievementId != null).map(notableMoment => notableMoment.name)).flat());
    }).catch(error => {
        console.log(error);
    });
}

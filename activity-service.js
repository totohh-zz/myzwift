const qs = require('qs');
const moment = require('moment');

class ActivityService {
    constructor(http) {
        this.apiService = http;
    }

    activityDetails = async (profileId, activityId) => {
        console.log(`Get activity [${activityId}] for profile: ${profileId}`);
        const response = await this.apiService.get(`/profiles/${profileId}/activities/${activityId}`);
        const data = {};
        if (response.data) {
            data.name = response.data.name;
            data.startDate = response.data.startDate;
            data.endDate = response.data.endDate;
            data.distanceInMeters = response.data.distanceInMeters;
            data.totalElevation = response.data.totalElevation;
            data.avgWatts = response.data.avgWatts;
            data.maxWatts = response.data.maxWatts;
            data.avgHeartRate = response.data.avgHeartRate;
            data.maxHeartRate = response.data.maxHeartRate;
            data.profileMaxHeartRate = response.data.profileMaxHeartRate;
            data.profileFtp = response.data.profileFtp;
            if (response.data.notableMoments) {
                data.notableMoments = response.data.notableMoments.map(notableMoment => JSON.parse(notableMoment.aux1));
            }
        }
        return data;
    };

    activities = async (profileId, before, data) => {
        const response = await this.apiService.get(`/profiles/${profileId}/activities?${qs.stringify({
            before: before,
            includeFollowees: false,
            includeInProgress: false,
            includeSelf: true,
            limit: 30,
            name: 'JUST ME'
        })}`);
        if (response.data && response.data.length > 0) {
            data = data.concat(await Promise.all(response.data.map(async activity => await this.activityDetails(profileId, activity.id_str))));
            const lastDate = moment(response.data[response.data.length - 1].startDate).format('x');
            if (lastDate !== before) {
                // return this.activities(profileId, lastDate, data);
            }
        }
        return data;
    };

    allActivities = async profileId => {
        console.log(`Get activities for profile: ${profileId}`);
        return this.activities(profileId, moment().format('x'), []);
    };
}

module.exports = ActivityService;

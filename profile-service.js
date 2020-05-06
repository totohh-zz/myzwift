class ProfileService {
    constructor(http, followService, activityService) {
        this.apiService = http;
        this.followService = followService;
        this.activityService = activityService;
    }

    profile = async profileId => {
        console.log(`Get profile: ${profileId}`);
        const response = await this.apiService.get(`/profiles/${profileId}`);
        const data = {};
        if (response.data) {
            data.id = response.data.id;
            data.firstName = response.data.firstName;
            data.lastName = response.data.lastName;
            data.bike = response.data.virtualBikeModel;
            data.ftp = response.data.ftp;
        }
        return data;
    };

    me = async () => {
        console.log('Get me');
        const response = await this.apiService.get(`/profiles/me`);
        const data = {};
        if (response.data) {
            data.id = response.data.id;
            data.firstName = response.data.firstName;
            data.lastName = response.data.lastName;
            data.bike = response.data.virtualBikeModel;
            data.ftp = response.data.ftp;
            //data.followers = await this.followService.followers(response.data.id);
            data.nbFollowers = response.data.socialFacts.followersCount;
            //data.followees = await this.followService.followees(response.data.id);
            data.nbFollowees = response.data.socialFacts.followeesCount;
            data.activities = await this.activityService.allActivities(response.data.id);
        }
        return data;
    };
}

module.exports = ProfileService;

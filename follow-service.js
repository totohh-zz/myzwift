class FollowService {
    constructor(http) {
        this.apiService = http;
    }

    followees = async profileId => {
        console.log(`Get followees: ${profileId}`);
        const response = await this.apiService.get(`/profiles/${profileId}/followees`);
        if (response.data) {
            return await Promise.all(response.data.map(async followee => await profileService.profile(followee.followeeId)));
        }
        return [];
    };

    followers = async profileId => {
        console.log(`Get followers: ${profileId}`);
        const response = await this.apiService.get(`/profiles/${profileId}/followers`);
        if (response.data) {
            return await Promise.all(response.data.map(async follower => await profileService.profile(follower.followerId)));
        }
        return [];
    };
}

module.exports = FollowService;

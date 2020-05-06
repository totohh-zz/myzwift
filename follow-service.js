class FollowService {
    constructor(http) {
        this.apiService = http;
    }

    followees = async profileId => {
        console.log(`Get followees: ${profileId}`);
        const response = await this.apiService.get(`/profiles/${profileId}/followees`);
        if (response.data) {
            return response.data.map(followee => followee.followeeId);
        }
        return [];
    };

    followers = async profileId => {
        console.log(`Get followers: ${profileId}`);
        const response = await this.apiService.get(`/profiles/${profileId}/followers`);
        if (response.data) {
            return response.data.map(follower => follower.followerId);
        }
        return [];
    };
}

module.exports = FollowService;

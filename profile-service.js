class ProfileService {
    constructor(http) {
        this.apiService = http;
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

    me = async () => this.profile('me');
}

module.exports = ProfileService;

const axios = require('axios').default;
const qs = require('qs');
const ProfileService = require('./profile-service');
const FollowService = require('./follow-service');
const ActivityService = require('./activity-service');

const ZWIFT_CLIENT_ID = 'Zwift_Mobile_Link';
const ZWIFT_LOGIN_URL = 'https://secure.zwift.com/auth/realms/zwift/tokens/access/codes';
const API_URL = 'https://us-or-rly101.zwift.com/api';
const API_VERSION = '2.5';

class ZwiftAccount {
    constructor(username, password) {
        this.http = axios.create({
            baseURL: API_URL,
            headers: {
                'Zwift-Api-Version': API_VERSION,
                Accept: 'application/json',
                'Cache-Control': 'no-cache',
                "Content-Type": "application/json"
            }
        });
        this.http.interceptors.request.use(async config => {
            if (!this.savedToken) {
                const response = await axios.post(ZWIFT_LOGIN_URL, qs.stringify({
                    client_id: ZWIFT_CLIENT_ID,
                    username: username,
                    password: password,
                    grant_type: 'password',
                }));
                if (response.data) {
                    this.savedToken = response.data.access_token;
                    config.headers['Authorization'] = `Bearer ${this.savedToken}`;
                }
                return config;
            }
            config.headers['Authorization'] = `Bearer ${this.savedToken}`;
            return config;
        });

        this.activityService = new ActivityService(this.http);
        this.followService = new FollowService(this.http);
        this.profileService = new ProfileService(this.http);
    }

    getMe = async () => {
        const profile = await this.profileService.me();

        const followersId = await this.followService.followers(profile.id);
        profile.followers = await Promise.all(followersId.map(id => this.profileService.profile(id)));
        const followeesId = await this.followService.followees(profile.id);
        profile.followees = await Promise.all(followeesId.map(id => this.profileService.profile(id)));
        profile.activities = await this.activityService.allActivities(profile.id);
        return profile;
    };
}

module.exports = ZwiftAccount;

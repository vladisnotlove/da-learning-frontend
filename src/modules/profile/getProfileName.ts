import ProfileModel from "Api/profile/models/ProfileModel";

const getProfileName = (profile: ProfileModel) => {
	if (profile.first_name && profile.last_name) {
		return profile.first_name + " " + profile.last_name;
	}
	if (profile.first_name) return profile.first_name;

	return profile.username;
};

export default getProfileName;

import RoleModel from "Api/profile/models/RoleModel";

type ProfileModel = {
	id: number,
	username: string,
	first_name?: string,
	last_name?: string,
	roles?: RoleModel[]
}

export default ProfileModel;

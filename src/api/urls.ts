const urls = {
	auth_login: () => "/auth/login",
	auth_logout: () => "/auth/logout",
	profile: () => "/profile",
	courses: (id?: number) => id === undefined ? "/courses" : "/courses/" + id
};

export default urls;

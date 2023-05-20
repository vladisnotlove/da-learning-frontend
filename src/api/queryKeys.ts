const queryKeys = {
	authLogin: () => "auth-login",
	authLogout: () => "auth-logout",
	profile: () => "profile",
	courses: () => "courses",
	course: (id: number) => ["course", id],
};

export default queryKeys;

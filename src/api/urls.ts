const urls = {
	auth_login: () => "/auth/login",
	auth_logout: () => "/auth/logout",
	profile: () => "/profile",
	mediaImages: () => "/media/images",
	learningConcepts: (id?: number) => id ? `/learning/concepts/${id}` : "/learning/concepts",
	learningRequirements: (id?: number) => id ? `/learning/requirements/${id}` : "/learning/requirements",
};

export default urls;

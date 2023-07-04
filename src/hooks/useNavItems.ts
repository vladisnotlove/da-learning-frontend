import useTranslation from "next-translate/useTranslation";
import {useMemo} from "react";
import {PageLayoutProps} from "Components/@layout/PageLayout";
import routes from "Constants/routes";
import useProfile from "Api/profile/useProfile";


const useNavItems = () => {
	const {t} = useTranslation();
	const profile = useProfile();

	return useMemo<PageLayoutProps["navItems"]>(() => {
		const roles = profile.data?.roles || [];

		const navItems = [
			{
				label: t("common:editor"),
				href: routes.editor(),
			},
		];
		if (roles.includes("teacher") || roles.includes("student") || roles.includes("classic_student")) {
			navItems.push({
				label: t("common:learningMap"),
				href: routes.concepts(),
			});
		}
		return navItems;
	}, [
		t,
		profile.data
	]);
};

export default useNavItems;

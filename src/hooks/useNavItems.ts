import useTranslation from "next-translate/useTranslation";
import {useMemo} from "react";
import {PageLayoutProps} from "Components/@layout/PageLayout";
import routes from "Constants/routes";
import useProfile from "Api/profile/useProfile";


const useNavItems = () => {
	const {t} = useTranslation();
	const profile = useProfile();

	return useMemo<PageLayoutProps["navItems"]>(() => {
		return [
			{
				label: t("common:editor"),
				href: routes.editor(),
			},
		].concat(profile.data?.roles?.find(role => role === "teacher") ? [
			{
				label: t("common:courses"),
				href: routes.courses(),
			}
		] : []);
	}, [
		t,
		profile.data
	]);
};

export default useNavItems;

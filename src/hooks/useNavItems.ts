import useTranslation from "next-translate/useTranslation";
import {useMemo} from "react";
import {PageLayoutProps} from "Components/@layout/PageLayout";
import routes from "Constants/routes";


const useNavItems = () => {
	const {t} = useTranslation();

	return useMemo<PageLayoutProps["navItems"]>(() => {
		return [
			{
				label: t("common:editor"),
				href: routes.editor(),
			},
		];
	}, [
		t
	]);
};

export default useNavItems;

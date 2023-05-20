import React from "react";
import PageLayout from "Components/@layout/PageLayout";
import useNavItems from "Hooks/useNavItems";
import useUrlParams from "Hooks/useUrlParams";
import {TRouteParams} from "Constants/routes";
import useCourse from "Api/courses/useCourse";

// Components

// Stores, utils, libs


type CoursePageProps = {
	className?: string,
	children?: React.ReactNode,
}

const CoursePage: React.FC<CoursePageProps> = (
	{
		className,
	}
) => {
	const navItems = useNavItems();
	const {urlParams} = useUrlParams<TRouteParams["courses"]>();

	const qCourse = useCourse(urlParams?.id || -1, {
		enabled: urlParams?.id !== undefined
	});

	return <PageLayout
		className={className}
		navItems={navItems}
	>
		{qCourse.data?.name}
	</PageLayout>;
};

export default CoursePage;

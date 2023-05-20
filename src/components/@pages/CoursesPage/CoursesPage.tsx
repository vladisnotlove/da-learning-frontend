import React from "react";
import Link from "next/link";
import routes from "Constants/routes";
import PageLayout from "Components/@layout/PageLayout";
import useNavItems from "Hooks/useNavItems";
import useCourses from "Api/courses/useCourses";

// Components

// Stores, utils, libs


type CoursesPageProps = {
	className?: string,
	children?: React.ReactNode,
}

const CoursesPage: React.FC<CoursesPageProps> = (
	{
		className,
	}
) => {
	const navItems = useNavItems();
	const qCourses = useCourses();

	console.log(qCourses);

	return <PageLayout
		className={className}
		navItems={navItems}
	>
		{qCourses.data?.map(course => {
			return <Link
				key={course.id}
				href={routes.courses({id: course.id})}
			>
				{course.name}
			</Link>;
		})}
	</PageLayout>;
};

export default CoursesPage;

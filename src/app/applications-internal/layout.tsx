'use client';

import { useRouter } from 'next/navigation';
import BaseLayout from '../components/BaseLayout';
import { saveSelectedOrganizationId } from '../localStorage';
import React from 'react';

const Layout = ({ children }: { children: React.ReactElement }) => {
	const router = useRouter();
	const handleClickLogo = () => {
		router.push('/applications');
	};

	return <BaseLayout onClickLogo={handleClickLogo}>{children}</BaseLayout>;
};

export default Layout;

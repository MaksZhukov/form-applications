'use client';

import { useRouter } from 'next/navigation';
import BaseLayout from '../_components/BaseLayout';
import { saveSelectedOrganizationId } from '../localStorage';
import React from 'react';

const Layout = ({ children }: { children: React.ReactElement }) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default Layout;

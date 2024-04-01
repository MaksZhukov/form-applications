'use client';

import BaseLayout from '../_components/BaseLayout';
import React from 'react';

const Layout = ({ children }: { children: React.ReactElement }) => {
	return <BaseLayout>{children}</BaseLayout>;
};

export default Layout;

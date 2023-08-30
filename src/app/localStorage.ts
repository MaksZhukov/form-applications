'use client';

export const saveLoginTime = (time: string) => typeof window !== 'undefined' && localStorage.setItem('loginTime', time);
export const getLoginTime = () => typeof window !== 'undefined' && localStorage.getItem('loginTime');
export const saveSelectedOrganizationId = (value: string) =>
	typeof window !== 'undefined' && localStorage.setItem('selectedOrganizationId', value);
export const getSelectedOrganizationId = () =>
	typeof window !== 'undefined' && localStorage.getItem('selectedOrganizationId');

'use client';

export const saveLoginTime = (time: string) => typeof window !== 'undefined' && localStorage.setItem('loginTime', time);
export const getLoginTime = () => typeof window !== 'undefined' && localStorage.getItem('loginTime');

export const saveSelectedOrganizationId = (value: string) =>
	typeof window !== 'undefined' && localStorage.setItem('selectedOrganizationId', value);
export const getSelectedOrganizationId = () =>
	(typeof window !== 'undefined' && localStorage.getItem('selectedOrganizationId')) || 'none';

export const saveSelectedStatus = (value: string) =>
	typeof window !== 'undefined' && localStorage.setItem('selectedStatus', value);
export const getSelectedStatus = () =>
	(typeof window !== 'undefined' && localStorage.getItem('selectedStatus')) || 'none';

export const saveSelectedResponsibleUserId = (value: string) =>
	typeof window !== 'undefined' && localStorage.setItem('selectedResponsibleUserId', value);
export const getSelectedResponsibleUserId = () =>
	(typeof window !== 'undefined' && localStorage.getItem('selectedResponsibleUserId')) || 'none';

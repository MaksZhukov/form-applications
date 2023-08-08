'use client';

export const saveLoginTime = (time: string) => typeof window !== 'undefined' && localStorage.setItem('loginTime', time);
export const getLoginTime = () => typeof window !== 'undefined' && localStorage.getItem('loginTime');

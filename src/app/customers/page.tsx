'use client';

import React, { ChangeEventHandler, useRef, useState } from 'react';
import { Button } from '@material-tailwind/react';
import TableCustomers from './TableCustomers';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

const Customers = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const debouncedSearch = useRef(
		debounce((search) => {
			const params = new URLSearchParams(Array.from(searchParams.entries()));
			params.set('search', search);
			router.push('/customers?' + params.toString());
		}, 300)
	).current;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		debouncedSearch(event.target.value);
	};
	return (
		<>
			<div className='flex gap-6 mb-4'>
				<Button className='bg-accent'>Новый клиент</Button>
				<input
					onChange={handleChange}
					defaultValue={searchParams.get('search') || ''}
					type='search'
					placeholder='Найти'
					className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-accent  p-3 inline-block focus:outline-none'
					required
				/>
			</div>
			<TableCustomers />
		</>
	);
};

export default Customers;

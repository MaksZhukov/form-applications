'use client';

import React, { ChangeEventHandler, useRef, useState } from 'react';
import { Button } from '@material-tailwind/react';
import TableCustomers from './TableCustomers';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import { createOrganization } from '../api/organizations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CreateUser from '../_features/CreateUser';
import CreateOrganization from '../_features/CreateOrganization';

const Customers = () => {
	const searchParams = useSearchParams();
	const createOrganizationMutation = useMutation(createOrganization);
	const client = useQueryClient();
	const [showModal, setShowModal] = useState<'createOrganization' | 'createUser' | null>(null);
	const router = useRouter();
	const debouncedSearch = useRef(
		debounce((search) => {
			const params = new URLSearchParams(Array.from(searchParams.entries()));
			if (search) {
				params.set('search', search);
			} else {
				params.delete('search');
			}
			params.set('page', '1');
			router.push('/customers?' + params.toString());
		}, 300)
	).current;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		debouncedSearch(event.target.value);
	};

	const handleCancel = () => {
		setShowModal(null);
	};

	const handleShowModal = (value: 'createOrganization' | 'createUser') => () => {
		setShowModal(value);
	};

	const handleCreatedOrganization = async () => {
		client.invalidateQueries(['customers']);
		setShowModal(null);
	};

	const handleCreated = () => {
		setShowModal(null);
	};

	return (
		<>
			<div className='flex items-center gap-6 mb-4'>
				<Button className='bg-accent' onClick={handleShowModal('createOrganization')}>
					Новая организация
				</Button>
				<Button className='bg-accent' onClick={handleShowModal('createUser')}>
					Новый сотрудник организации
				</Button>
				<input
					onChange={handleChange}
					defaultValue={searchParams.get('search') || ''}
					type='search'
					placeholder='Найти'
					className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-accent  p-2.5 inline-block focus:outline-none'
					required
				/>
			</div>
			<TableCustomers />
			{showModal === 'createOrganization' && (
				<CreateOrganization onCancel={handleCancel} onCreated={handleCreatedOrganization}></CreateOrganization>
			)}
			{showModal === 'createUser' && <CreateUser onCreated={handleCreated} onCancel={handleCancel} />}
		</>
	);
};

export default Customers;

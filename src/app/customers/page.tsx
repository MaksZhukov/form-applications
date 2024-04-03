'use client';

import React, { ChangeEventHandler, FormEventHandler, useRef, useState } from 'react';
import { Button } from '@material-tailwind/react';
import TableCustomers from './TableCustomers';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import ModalCreateOrganization from '../_components/modals/ModalCreateOrganization';
import { createOrganization } from '../api/organizations';
import { createUser } from '../api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '../localStorage';
import CreateUser from '../_features/CreateUser';

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

	const handleSubmitCreateOrganization: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await createOrganizationMutation.mutateAsync(formData);
		client.refetchQueries({ queryKey: ['organizations', getLoginTime()] });
		alert('Организация добавлена');
		setShowModal('createUser');
	};

	const handleCreated = () => {
		client.invalidateQueries(['customers']);
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
				<ModalCreateOrganization onSubmit={handleSubmitCreateOrganization} onCancel={handleCancel} />
			)}
			{showModal === 'createUser' && <CreateUser onCreated={handleCreated} onCancel={handleCancel} />}
		</>
	);
};

export default Customers;

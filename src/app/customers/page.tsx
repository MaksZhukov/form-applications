'use client';

import React, { ChangeEventHandler, FormEventHandler, useRef, useState } from 'react';
import { Button } from '@material-tailwind/react';
import TableCustomers from './TableCustomers';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import ModalCreateOrganization from '../_components/modals/ModalCreateOrganization';
import ModalCreateUser from '../_components/modals/ModalCreateUser';
import { createOrganization } from '../api/organizations';
import { createUser } from '../api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '../localStorage';

const Customers = () => {
	const searchParams = useSearchParams();
	const createOrganizationMutation = useMutation(createOrganization);
	const createUserMutation = useMutation(createUser);
	const client = useQueryClient();
	const [showModal, setShowModal] = useState<'createOrganization' | 'createUser' | null>(null);
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

	const handleSubmitCreateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		await createUserMutation.mutateAsync(formData);
		client.invalidateQueries(['customers']);
		alert('Пользователь добавлен');
		setShowModal(null);
	};

	return (
		<>
			<div className='flex gap-6 mb-4'>
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
					className='border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-accent  p-3 inline-block focus:outline-none'
					required
				/>
			</div>
			<TableCustomers />
			{showModal === 'createOrganization' && (
				<ModalCreateOrganization onSubmit={handleSubmitCreateOrganization} onCancel={handleCancel} />
			)}
			{showModal === 'createUser' && (
				<ModalCreateUser onSubmit={handleSubmitCreateUser} onCancel={handleCancel} />
			)}
		</>
	);
};

export default Customers;

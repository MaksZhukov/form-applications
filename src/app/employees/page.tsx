'use client';

import React, { FormEventHandler, useState } from 'react';
import { Button } from '@material-tailwind/react';
import ModalCreateUser from '../components/modals/ModalCreateUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/users';
import { getLoginTime } from '../localStorage';
import TableEmployees from './TableEmployees';

const Employees = () => {
	const [showModal, setShowModal] = useState<'createUser' | 'updateUser' | null>(null);
	const createUserMutation = useMutation(createUser);
	const client = useQueryClient();
	const handleClickNewEmployee = () => {
		setShowModal('createUser');
	};
	const handleCancel = () => {
		setShowModal(null);
	};

	const handleSubmitCreateUser: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		formData.append('organizationId', process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID);
		await createUserMutation.mutateAsync(formData);
		client.refetchQueries({ queryKey: ['employees', getLoginTime()] });
		alert('Пользователь добавлен');
		setShowModal(null);
	};
	return (
		<>
			<Button className='mb-4 bg-accent' onClick={handleClickNewEmployee}>
				Новый сотрудник
			</Button>
			<TableEmployees />
			{showModal === 'createUser' && (
				<ModalCreateUser
					title='Добавить сотрудника'
					withOrganization={false}
					onCancel={handleCancel}
					onSubmit={handleSubmitCreateUser}></ModalCreateUser>
			)}
		</>
	);
};

export default Employees;

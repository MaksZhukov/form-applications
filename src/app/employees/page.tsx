'use client';

import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import TableEmployees from './TableEmployees';
import CreateUser from '../_features/CreateUser';
import { useQueryClient } from '@tanstack/react-query';

const Employees = () => {
	const [showModal, setShowModal] = useState<'createUser' | null>(null);
	const client = useQueryClient();
	const handleClickNewEmployee = () => {
		setShowModal('createUser');
	};
	const handleCancel = () => {
		setShowModal(null);
	};

	const handleCreateUser = () => {
		client.invalidateQueries(['employees']);
		setShowModal(null);
	};
	return (
		<>
			<Button className='mb-4 bg-accent' onClick={handleClickNewEmployee}>
				Новый сотрудник
			</Button>
			<TableEmployees />
			{showModal === 'createUser' && (
				<CreateUser
					title='Добавить сотрудника'
					withOrganization={false}
					defaultOrganization={process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID}
					onCancel={handleCancel}
					onCreated={handleCreateUser}></CreateUser>
			)}
		</>
	);
};

export default Employees;

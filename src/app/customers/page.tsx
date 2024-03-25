'use client';

import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/users';

const Customers = () => {
	// const [showModal, setShowModal] = useState<'createUser' | 'updateUser' | null>(null);
	// const createUserMutation = useMutation(createUser);
	// const client = useQueryClient();
	return (
		<>
			<Button className='mb-4 bg-accent'>Новый клиент</Button>
		</>
	);
};

export default Customers;

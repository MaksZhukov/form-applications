import { Button } from '@material-tailwind/react';
import LaborCostsTable from './LaborCostsTable';
import ModalAddLaborCosts from './ModalAddLaborCosts';
import { useState } from 'react';

const LaborCosts = () => {
	const [isModalAddLaborCostsOpen, setIsModalAddLaborCostsOpen] = useState<boolean>(false);
	const handleClick = () => {
		setIsModalAddLaborCostsOpen(true);
	};

	const handleCancel = () => {
		setIsModalAddLaborCostsOpen(false);
	};

	const handleSubmit = () => {
		setIsModalAddLaborCostsOpen(true);
	};
	return (
		<div className='flex-0.5'>
			<div className='text-right'>
				<Button size='sm' className='bg-accent' onClick={handleClick}>
					Добавить трудозатраты
				</Button>
			</div>
			<LaborCostsTable
				data={[
					{
						date: new Date(),
						description: 'Test hello bro',
						employee: { name: 'Maksim' },
						timeSpent: '8h',
						kindOfWork: 'Выполнение заданий',
					},
					{
						date: new Date(),
						description: 'Test hello bro',
						employee: { name: 'Maksim' },
						timeSpent: '8h',
						kindOfWork: 'Выполнение заданий',
					},
					{
						date: new Date(),
						description: 'Test hello bro',
						employee: { name: 'Maksim' },
						timeSpent: '8h',
						kindOfWork: 'Выполнение заданий',
					},
					{
						date: new Date(),
						description: 'Test hello bro',
						employee: { name: 'Maksim' },
						timeSpent: '8h',
						kindOfWork: 'Выполнение заданий',
					},
					{
						date: new Date(),
						description: 'Test hello bro',
						employee: { name: 'Maksim' },
						timeSpent: '8h',
						kindOfWork: 'Выполнение заданий',
					},
					{
						date: new Date(),
						description: 'Test hello bro',
						employee: { name: 'Maksim' },
						timeSpent: '8h',
						kindOfWork: 'Выполнение заданий',
					},
				]}
			></LaborCostsTable>
			{isModalAddLaborCostsOpen && (
				<ModalAddLaborCosts onSubmit={handleSubmit} onCancel={handleCancel}></ModalAddLaborCosts>
			)}
		</div>
	);
};

export default LaborCosts;

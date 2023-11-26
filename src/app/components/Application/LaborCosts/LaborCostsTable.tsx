import { LaborCostsAttributes } from '@/db/laborCosts/types';
import { Typography } from '@material-tailwind/react';
import { FC } from 'react';
import { MAP_HOURS_OF_WORK_TO_VALUES } from './constants';

const TABLE_HEAD = [
	{ name: 'Дата', width: 100 },
	{ name: 'Сотрудник', width: 150 },
	{ name: 'Вид работы', width: 150 },
	{ name: 'Количество времени', width: 100 },
	{ name: 'Описание' }
];

interface Props {
	data: LaborCostsAttributes[];
}

const LaborCostsTable: FC<Props> = ({ data }) => {
	const total = data.reduce(
		(prev, curr) => prev + MAP_HOURS_OF_WORK_TO_VALUES[curr.timeSpent as keyof typeof MAP_HOURS_OF_WORK_TO_VALUES],
		0
	);
	return (
		<>
			<div className='overflow-y-auto max-h-[236px]'>
				<table className='w-full table-auto text-left'>
					<thead>
						<tr className='bg-white'>
							{TABLE_HEAD.map((head) => (
								<th
									key={head.name}
									style={{ width: head.width }}
									className='bg-white sticky top-0 border-b border-gray-100 p-3'>
									<Typography variant='small' className='font-bold leading-none opacity-90'>
										{head.name}
									</Typography>
								</th>
							))}
						</tr>
					</thead>
					<tbody className=''>
						{data.map((item, index) => {
							const isLast = index === data.length - 1;
							const classes = isLast
								? 'w-full p-3 align-baseline'
								: 'w-full p-3 border-b border-accent align-baseline';
							return (
								<tr key={item.id}>
									<td className={classes} style={{ width: 100 }}>
										<Typography variant='small' className='font-normal'>
											{item.date}
										</Typography>
									</td>
									<td className={classes + ' max-w-xs'} style={{ width: 150 }}>
										<Typography variant='small' className='font-normal'>
											{item.employee?.name}
										</Typography>
									</td>

									<td className={classes + ' max-w-xs'} style={{ width: 150 }}>
										<Typography variant='small' className='font-normal'>
											{item.kindsOfWork?.name}
										</Typography>
									</td>

									<td className={classes} style={{ width: 100 }}>
										<Typography variant='small' className='font-normal'>
											{item.timeSpent}
										</Typography>
									</td>
									<td className={classes}>
										<Typography variant='small' className='font-normal'>
											{item.description}
										</Typography>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{!!total && <div className='pl-3'>Итого: {total} часов</div>}
		</>
	);
};

export default LaborCostsTable;

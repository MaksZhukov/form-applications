import { LaborCostsAttributes } from '@/db/laborCosts/types';
import { Typography } from '@material-tailwind/react';
import { FC } from 'react';

const TABLE_HEAD = [
	{ name: 'Дата' },
	{ name: 'Сотрудник' },
	{ name: 'Вид работы' },
	{ name: 'Количество часов' },
	{ name: 'Описание', width: 200 }
];

interface Props {
	data: LaborCostsAttributes[];
}

const LaborCostsTable: FC<Props> = ({ data }) => {
	return (
		<div className='overflow-y-auto max-h-[260px]'>
			<table className='w-full table-auto text-left'>
				<thead>
					<tr className='bg-white'>
						{TABLE_HEAD.map((head) => (
							<th key={head.name} className='bg-white sticky top-0 border-b border-gray-100 p-3'>
								<Typography
									style={{ width: head.width }}
									variant='small'
									className='font-bold leading-none opacity-90'>
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
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.date}
									</Typography>
								</td>
								<td className={classes + ' max-w-xs'}>
									<Typography variant='small' className='font-normal'>
										{item.employee?.name}
									</Typography>
								</td>

								<td className={classes + ' max-w-xs'}>
									<Typography variant='small' className='font-normal'>
										{item.kindsOfWork?.name}
									</Typography>
								</td>

								<td className={classes}>
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
	);
};

export default LaborCostsTable;

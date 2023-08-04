import { ApiApplication } from '@/app/api/applications/types';
import { API_LIMIT_ITEMS } from '@/constants';
import { Button, ButtonGroup, IconButton, Typography } from '@material-tailwind/react';
import { FC } from 'react';

const TABLE_HEAD = ['№', 'Наименование задачи', 'Дата установки задачи', 'Дедлайн задачи', 'Статус', ''];

interface Props {
	data: ApiApplication[];
	total: number;
	page: number;
	onChangePage: (page: number) => () => void;
	onClickMore: (item: ApiApplication) => void;
}

const Table: FC<Props> = ({ data, total, page, onChangePage, onClickMore }) => {
	const handleClickMore = (item: ApiApplication) => () => {
		onClickMore(item);
	};

	const countPages = Math.ceil(total / API_LIMIT_ITEMS);

	return (
		<>
			<table className='w-full min-w-max table-auto text-left'>
				<thead>
					<tr>
						{TABLE_HEAD.map((head) => (
							<th key={head} className='border-b border-gray-100 p-3'>
								<Typography variant='small' className='font-normal leading-none opacity-90'>
									{head}
								</Typography>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((item, index) => {
						const isLast = index === data.length - 1;
						const classes = isLast ? 'p-3 align-baseline' : 'p-3 border-b border-accent align-baseline';

						return (
							<tr key={item.title}>
								<td className={classes}>AM-{item.id.toString().padStart(6, '0')}</td>
								<td className={classes + ' max-w-xs'}>
									<Typography variant='medium' className='font-normal'>
										{item.title}
									</Typography>
									<Typography className='font-normal text-xs'>
										Описание. {item.description}
									</Typography>
								</td>
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.date}
									</Typography>
								</td>
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.deadline}
									</Typography>
								</td>
								<td className={classes}>
									<Typography variant='small' className='font-normal'>
										{item.status}
									</Typography>
								</td>
								<td className={classes}>
									<Button
										variant='outlined'
										className='border-accent text-accent'
										onClick={handleClickMore(item)}>
										Подробнее
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className='w-full flex'>
				{countPages > 1 && (
					<ButtonGroup variant='outlined' className='mx-auto'>
						{new Array(countPages).fill(null).map((item, index) => (
							<IconButton
								key={index + 1}
								className={page === index + 1 ? 'bg-blue-100 text-blue-gray-900' : ''}
								onClick={onChangePage(index + 1)}>
								{index + 1}
							</IconButton>
						))}
					</ButtonGroup>
				)}
			</div>
		</>
	);
};

export default Table;

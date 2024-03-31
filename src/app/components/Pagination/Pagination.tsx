import { MAX_PART_PAGINATION } from '@/constants';
import { ButtonGroup, IconButton } from '@material-tailwind/react';
import { FC, useState } from 'react';

interface Props {
	countPages: number;
	page: number;
	onChangePage: (value: number) => () => void;
}

const Pagination: FC<Props> = ({ countPages, page, onChangePage }) => {
	const [partPagination, setPartPagination] = useState<number>(1);

	const countPagesByPart =
		MAX_PART_PAGINATION * partPagination > countPages
			? countPages - MAX_PART_PAGINATION * (partPagination - 1)
			: MAX_PART_PAGINATION;
	const maxPartPaginationCount = Math.ceil(countPages / MAX_PART_PAGINATION);

	const handleChangePart = (value: number) => () => {
		setPartPagination(value);
	};

	return (
		<div className='w-full flex'>
			{countPages > 1 && (
				<ButtonGroup variant='outlined' className='mx-auto'>
					{partPagination > 1 && <IconButton onClick={handleChangePart(partPagination - 1)}>...</IconButton>}
					{new Array(countPagesByPart).fill(null).map((item, index) => {
						const currentPage = index + MAX_PART_PAGINATION * (partPagination - 1) + 1;
						return (
							<IconButton
								key={currentPage}
								className={
									page === currentPage
										? 'bg-blue-100 text-blue-gray-900'
										: index + 1 === countPagesByPart && partPagination === maxPartPaginationCount
										? 'border-r-1'
										: ''
								}
								onClick={onChangePage(currentPage)}>
								{currentPage}
							</IconButton>
						);
					})}
					{partPagination !== maxPartPaginationCount && (
						<IconButton onClick={handleChangePart(partPagination + 1)}>...</IconButton>
					)}
				</ButtonGroup>
			)}
		</div>
	);
};

export default Pagination;

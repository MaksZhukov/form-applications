import { Button } from '@material-tailwind/react';
import LaborCostsTable from './LaborCostsTable';
import ModalAddLaborCosts from './ModalAddLaborCosts';
import { FC, FormEventHandler, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLoginTime } from '@/app/localStorage';
import { createLaborCosts, fetchLaborCosts } from '@/app/api/labor-costs';
import { ApiResponse } from '@/app/api/types';
import { LaborCostsAttributes } from '@/db/laborCosts/types';

interface Props {
	applicationId: number;
}

const LaborCosts: FC<Props> = ({ applicationId }) => {
	const [isModalAddLaborCostsOpen, setIsModalAddLaborCostsOpen] = useState<boolean>(false);

	const client = useQueryClient();

	const { data } = useQuery(['laborCosts', getLoginTime()], {
		retry: 0,
		staleTime: Infinity,
		queryFn: () => fetchLaborCosts({ applicationId })
	});

	const createLaborCostsMutation = useMutation({
		mutationFn: (data: FormData) => createLaborCosts({ data, applicationId })
	});

	const handleClick = () => {
		setIsModalAddLaborCostsOpen(true);
	};

	const handleCancel = () => {
		setIsModalAddLaborCostsOpen(false);
	};

	const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const {
			data: { data: createdLaborCosts }
		} = await createLaborCostsMutation.mutateAsync(formData);
		client.setQueryData<ApiResponse<LaborCostsAttributes[]>>(['laborCosts', getLoginTime()], (prev) =>
			prev
				? {
						...prev,
						data: [...prev.data, createdLaborCosts]
				  }
				: undefined
		);
		setIsModalAddLaborCostsOpen(false);
	};
	return (
		<div className='flex-0.5'>
			<div className='text-right'>
				<Button size='sm' className='bg-accent' onClick={handleClick}>
					Добавить трудозатраты
				</Button>
			</div>
			<LaborCostsTable data={data?.data || []}></LaborCostsTable>
			{isModalAddLaborCostsOpen && (
				<ModalAddLaborCosts onSubmit={handleSubmit} onCancel={handleCancel}></ModalAddLaborCosts>
			)}
		</div>
	);
};

export default LaborCosts;

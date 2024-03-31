import { fetchUsers } from '@/app/api/users';
import { getLoginTime } from '@/app/localStorage';
import { Typography } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { ChangeEventHandler, FC } from 'react';

interface Props {
	value?: string;
	name?: string;
	className?: string;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
}

const ResponsibleUserSelect: FC<Props> = ({ name = 'responsibleUserId', value, className = '', onChange }) => {
	const { data, isFetched } = useQuery({
		queryKey: ['employees', getLoginTime(), 'isActive'],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchUsers({ organizationId: +process.env.NEXT_PUBLIC_OWNER_ORGANIZATION_ID, isActive: true })
	});

	return (
		<select
			defaultValue={value}
			key={+isFetched}
			name={name}
			onChange={onChange}
			className={`font-normal border border-gray-300 text-sm rounded-lg block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none ${className}`}>
			<option value='none'>Не выбрано</option>
			{data?.data
				.filter((item) => item.isActive)
				.map((item) => (
					<option key={item.id} value={item.id}>
						{item.name}
					</option>
				))}
		</select>
	);
};

export default ResponsibleUserSelect;

import { fetchComments } from '@/app/api/comments';
import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import ArrowUpIcon from '@/icons/ArrowUpIcon';
import { IconButton } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { ChangeEvent, FC, useState } from 'react';

interface Props {
	applicationId: number;
}

const Chat: FC<Props> = ({ applicationId }) => {
	const [value, setValue] = useState<string>('');
	const { data, error, isError, isLoading } = useQuery({
		queryKey: ['user', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: fetchUser
	});

	const { data: dataComments } = useQuery({
		queryKey: ['comments', getLoginTime()],
		staleTime: Infinity,
		retry: 0,
		queryFn: () => fetchComments(applicationId)
	});

	console.log(dataComments);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
	};

	const handleClick = () => {};
	const messages = [
		{ text: 'textwqf fwqqwf qwf fwq  wf', userName: 'Admin' },
		{ text: 'text1', userName: 'another' },
		{ text: 'text2 wqwffqwfqw fqw q wf', userName: 'Admin' },
		{ text: 'text3qwffqw ', userName: 'another' },
		{ text: 'text3qwf fwqfwq f', userName: 'another' },
		{ text: 'text3qwf fq ', userName: 'another' },
		{ text: 'text3wqf f wqqwf', userName: 'another' }
	];
	console.log(data?.data);
	return (
		<div className='fixed top-20 right-0  h-[calc(100%-170px)] 2xl:w-[20%] xl:w-[20%] lg:w-[15%] z-10 flex flex-col'>
			<div className='flex flex-col p-2 border text-center border-gray-300'>
				<span className='leading-4'>{data?.data?.organization.name}</span>
				<span className='text-xs text-accent'>online</span>
			</div>
			<div className='px-6 py-1 overflow-auto flex-1 border-l border-gray-300'>
				{messages.map((item, index) => (
					<div
						key={index}
						className={`py-2 flex flex-row w-full ${
							item.userName === data?.data?.organization.name ? 'justify-end' : 'justify-start'
						}`}>
						<div
							className={`px-2 w-fit py-1 border border-accent flex flex-col rounded-lg ${
								item.userName === data?.data?.organization.name
									? 'order-1 mr-2'
									: 'bg-gray-100 order-2 ml-2'
							}`}>
							{item.text}
						</div>
					</div>
				))}
			</div>
			<div className='flex pr-6'>
				<textarea
					value={value}
					onChange={handleChange}
					className='flex-1 mr-4 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					required
					placeholder='Текст Сооющения...'
				/>
				<IconButton className='bg-accent' onClick={handleClick}>
					<ArrowUpIcon></ArrowUpIcon>
				</IconButton>
			</div>
		</div>
	);
};

export default Chat;

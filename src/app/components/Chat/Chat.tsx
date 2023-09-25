import { fetchComments } from '@/app/api/comments';
import { ApiResponse } from '@/app/api/types';
import { fetchUser } from '@/app/api/user';
import { getLoginTime } from '@/app/localStorage';
import { socketService } from '@/app/socket';
import { CommentAttributes } from '@/db/comment/types';
import ArrowUpIcon from '@/icons/ArrowUpIcon';
import { IconButton } from '@material-tailwind/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

interface Props {
	applicationId: number;
}

const Chat: FC<Props> = ({ applicationId }) => {
	const [value, setValue] = useState<string>('');
	const client = useQueryClient();
	const listRef = useRef<HTMLDivElement>(null);
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

	useEffect(() => {
		if (listRef.current) {
			listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
		}
	}, [dataComments?.data.length]);

	useEffect(() => {
		socketService.socket?.emit('join-application-comments', applicationId);
		socketService.socket?.on('join-application-comments', () => {
			console.log('Joined to application comments');
		});
		socketService.socket?.on('comment', (comment: CommentAttributes) => {
			client.setQueryData<ApiResponse<CommentAttributes[]>>(['comments', getLoginTime()], (currData) => ({
				...currData,
				data: [...(currData?.data || []), comment]
			}));
			setValue('');
		});
	}, []);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value);
	};

	const handleClick = () => {
		socketService.socket?.emit('comment', { text: value, applicationId, userId: data?.data.id });
	};

	return (
		<div className='fixed top-20 right-0  h-[calc(100%-170px)] 2xl:w-[20%] xl:w-[20%] lg:w-[15%] z-10 flex flex-col'>
			<div className='flex flex-col p-2 border text-center border-gray-300'>
				<span className='leading-4'>{data?.data?.organization.name}</span>
				<span className='text-xs text-accent'>online</span>
			</div>
			<div ref={listRef} className='px-3 py-1 overflow-auto flex-1 border-l border-gray-300'>
				{dataComments?.data.map((item, index) => {
					const prevItem = dataComments?.data[index - 1];
					return (
						<div
							key={index}
							className={`py-2 flex flex-row w-full ${
								item.user.id === data?.data.id ? 'justify-end' : 'justify-start'
							}`}>
							<div
								className={`px-2 w-fit py-1 flex flex-col rounded-lg ${
									item.user.id === data?.data.id ? 'order-1' : 'order-2'
								}`}>
								{prevItem?.user.id !== item.user.id && (
									<div
										className={`text-accent ${
											item.user.id === data?.data.id ? 'text-right' : 'text-left'
										}`}>
										{item.user.name}
									</div>
								)}
								<div
									className={`px-2 w-fit py-1 border border-accent flex flex-col rounded-lg ${
										item.user.id === data?.data.id ? 'order-1' : 'bg-gray-100 order-2'
									}`}>
									{item.text}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className='flex pr-6'>
				<textarea
					value={value}
					onChange={handleChange}
					className='flex-1 mr-4 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
					placeholder='Текст Сооющения...'
				/>
				<IconButton className='bg-accent' disabled={!value} onClick={handleClick}>
					<ArrowUpIcon></ArrowUpIcon>
				</IconButton>
			</div>
		</div>
	);
};

export default Chat;

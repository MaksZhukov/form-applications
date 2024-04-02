import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { AutocompleteItem } from './types';

interface Props {
	data: AutocompleteItem[];
	onChange: (item: AutocompleteItem) => void;
	value: string;
}

const Autocomplete: FC<Props> = ({ data, value, onChange }) => {
	const [search, setSearch] = useState<string>('');
	const [isTyped, setIsTyped] = useState<boolean>(false);
	const [showList, setShowList] = useState<boolean>(false);

	useEffect(() => {
		const selectedItem = data.find((item) => item.value === value);
		setSearch(selectedItem?.title || '');
	}, [value, data.length]);

	const handleFocus = () => {
		setShowList(true);
	};

	const handleBlur = () => {
		setShowList(true);
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setIsTyped(true);
		setSearch(e.target.value);
	};

	const handleSelect = (item: AutocompleteItem) => () => {
		setSearch(item.title);
		setShowList(false);
		setIsTyped(false);
		onChange(item);
	};

	return (
		<div className='relative my-1'>
			<input
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				type='text'
				value={search}
				className='font-normal border border-gray-300 text-sm rounded-lg block w-full px-2 py-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-accent focus:outline-none'
				name='departmentName'
				required
			/>
			{showList && (
				<ul className='max-h-60 w-full p-2 bg-white overflow-auto absolute top-6 z-10 shadow-md'>
					{(isTyped
						? data.filter((item) =>
								Object.keys(item).some((key) => item[key].toLowerCase().includes(search.toLowerCase()))
						  )
						: data
					).map((item) => (
						<li
							key={item.value}
							className='px-2 py-2 cursor-pointer font-normal hover:bg-opacity-25 hover:bg-accent break-words'
							onClick={handleSelect(item)}>
							{item.title}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Autocomplete;

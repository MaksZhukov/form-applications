import { useState } from 'react';
import { ApiApplication } from './api/applications/types';
import ApplicationModal from './components/ApplicationModal';

export default function Home() {
	const [isOpenModal, setIsOpenModal] = useState<boolean>(true);
	const [applicationData, setApplicationData] = useState<ApiApplication | null>(null);
	const handleSave = (data: ApiApplication) => {
		setApplicationData(data);
	};
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			MAIN PAGE
			{isOpenModal && <ApplicationModal data={applicationData} onSave={handleSave}></ApplicationModal>}
		</main>
	);
}

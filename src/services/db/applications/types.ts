export type ApplicationStatus = 'В обработке' | 'В работе' | 'Выполена';

export type Application = {
	id: number;
	date: string;
	title: string;
	description: string;
	deadline: string;
	phone: string;
	comment: string;
	status: ApplicationStatus;
	name: string;
	email: string;
	created_at: string;
	user_id: number;
};

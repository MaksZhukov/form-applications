import { LaborCostsAttributes } from '@/db/laborCosts/types';
import client from '../client';
import { ApiResponse } from '../types';
import { KindsOfWorkAttributes } from '@/db/kindsOfWork/types';

export const fetchLaborCosts = (params: { applicationId: number }) =>
	client.get<ApiResponse<LaborCostsAttributes[]>>(`/api/labor-costs`, { params }).then((res) => res.data);

export const createLaborCosts = ({ applicationId, data }: { data: FormData; applicationId: number }) =>
	client.post<ApiResponse<LaborCostsAttributes>>(`/api/labor-costs`, data, { params: { applicationId } });

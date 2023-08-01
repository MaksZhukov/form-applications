import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

export const sign = (data: any) =>
	new SignJWT(data)
		.setExpirationTime('30d')
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.sign(new TextEncoder().encode(process.env.JWT_SECRET));
export const verify = (token: string) => jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

export const getBearerToken = (request: NextRequest) => request.headers.get('authorization')?.split(' ')[1];

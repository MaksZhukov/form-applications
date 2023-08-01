import { FastRateLimit } from 'fast-ratelimit';
import { NextRequest } from 'next/server';
import requestIp from 'request-ip';

const rateLimit = new FastRateLimit({ threshold: 20, ttl: 60 });

export default function hasRateLimit(request: NextRequest) {
	const detectedIp = requestIp.getClientIp(request as any);
	let namespace = detectedIp + '-' + request.url + '-' + request.method;
	return !rateLimit.consumeSync(namespace);
}

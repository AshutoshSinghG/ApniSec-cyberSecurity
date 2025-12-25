import { NextRequest } from 'next/server';
import ApiError from '../errors/ApiError';

// rate limit entry interface
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// rate limiter class
class RateLimiter {
    private requests: Map<string, RateLimitEntry>;
    private limit: number;
    private windowMs: number;

    constructor(limit: number = 100, windowMinutes: number = 15) {
        this.requests = new Map();
        this.limit = limit;
        this.windowMs = windowMinutes * 60 * 1000; // convert to milliseconds
    }

    // check rate limit for ip address
    checkRateLimit(request: NextRequest): {
        allowed: boolean;
        remaining: number;
        resetTime: number;
    } {
        // get client ip address
        const ip = this.getClientIp(request);
        const now = Date.now();

        // get or create rate limit entry
        let entry = this.requests.get(ip);

        // if no entry or window expired, create new entry
        if (!entry || now > entry.resetTime) {
            entry = {
                count: 1,
                resetTime: now + this.windowMs,
            };
            this.requests.set(ip, entry);

            return {
                allowed: true,
                remaining: this.limit - 1,
                resetTime: entry.resetTime,
            };
        }

        // increment request count
        entry.count++;

        // check if limit exceeded
        if (entry.count > this.limit) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: entry.resetTime,
            };
        }

        return {
            allowed: true,
            remaining: this.limit - entry.count,
            resetTime: entry.resetTime,
        };
    }

    // get client ip address
    private getClientIp(request: NextRequest): string {
        // try to get ip from headers
        const forwarded = request.headers.get('x-forwarded-for');
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }

        const realIp = request.headers.get('x-real-ip');
        if (realIp) {
            return realIp;
        }

        // fallback to a default value
        return 'unknown';
    }

    // clean up expired entries periodically
    cleanup(): void {
        const now = Date.now();
        for (const [ip, entry] of this.requests.entries()) {
            if (now > entry.resetTime) {
                this.requests.delete(ip);
            }
        }
    }
}

export default RateLimiter;

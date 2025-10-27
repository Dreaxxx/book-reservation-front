import { AxiosError } from 'axios';

function pickMessageFromData(data: any): string | null {
    if (!data) return null;
    if (Array.isArray(data.message)) return data.message.join(', ');
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
    if (typeof data.detail === 'string') return data.detail;       // Prisma
    if (typeof data.title === 'string') return data.title;
    return null;
}

export function toErrorMessage(error: unknown, fallback = 'Une erreur c\'est produite'): string {
    try {
        if (error instanceof AxiosError) {
            const m =
                pickMessageFromData(error.response?.data) ||
                error.message ||
                fallback;
            return m;
        }
        if (error instanceof Error) {
            return error.message || fallback;
        }
        if (typeof error === 'string') return error;
        return fallback;
    } catch {
        return fallback;
    }
}

import axios from "axios";

export function handleApiError(error: unknown): never{
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.errors || "Terjadi kesalahan, silahkan coba lagi.");
    }
    throw new Error("Terjadi kesalahan.");
}
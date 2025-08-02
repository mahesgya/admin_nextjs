import axios from "axios";
import { handleApiError } from "@/lib/errorHandle";
import { OrderResponses, Orders, OrderSingleResponse } from "@/types/order";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const orderService = {
    getOrders: async (accessToken: string, startDate?: string, endDate?: string) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: { [key: string]: any } = {};

            if (startDate) {
                params.startDate = startDate;
            }
            if (endDate) {
                params.endDate = endDate;
            }

            const response = await axios.get<OrderResponses>(`${BASE_URL}/api/admin/orders`, {
                params: params, 
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const orders: Orders[] = response.data.data;
            return orders;
        } catch (error) {
            handleApiError(error);
        }
    },
    getOrderById: async (accessToken: string, orderId: string) => {
        try {
            const response = await axios.get<OrderSingleResponse>(`${BASE_URL}/api/admin/order/${orderId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const orders: Orders = response.data.data;
            return orders;
        } catch (error) {
            handleApiError(error);
        }
    },
    exportExcel: async (accessToken: string, startDate?: string, endDate?: string) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: { [key: string]: any } = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await axios.get(`${BASE_URL}/api/admin/orders/excel`, {
                params: params,
                headers: { Authorization: `Bearer ${accessToken}` },
                responseType: 'blob', 
            });
            return response;
        } catch (error) {
            handleApiError(error);
        }
    },
    updateOrder: async (idOrder : string, editedData : Partial<Pick<Orders, "status" | "weight" | "price" | "status_payment">>  , accessToken : string) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/order/${idOrder}/status`, editedData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    postPaymentReminders: async (accessToken: string, idOrder: string) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/customer/order/${idOrder}/reminders/payment`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default orderService
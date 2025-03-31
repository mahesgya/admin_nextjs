import axios from "axios";
import { handleApiError } from "@/lib/errorHandle";
import { OrdersResponse, Order } from "@/types/order";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const orderService = {
    getOrders: async (accessToken:string) => {
        try {
            const response = await axios.get<OrdersResponse>(`${BASE_URL}/api/admin/order`,{
                headers : {Authorization : `Bearer ${accessToken}`},
            })
            const orders: Order[] = response.data.data;
            return orders;
        } catch (error) {
            handleApiError(error)
        }
    },
    updateOrder: async (idOrder : string, editedData : Partial<Pick<Order, "status" | "weight" | "price" | "status_payment">>  , accessToken : string) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/admin/order/${idOrder}/status`, editedData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
}

export default orderService
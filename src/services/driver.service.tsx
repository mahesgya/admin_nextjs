import { handleApiError } from "@/lib/errorHandle";
import { DriverData, DriverForm, DriverResponse, PostDriverResponse } from "@/types/driver";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const driverService = {
    getDrivers: async (accessToken: string) => {
        try {
            const response = await axios.get<DriverResponse>(`${BASE_URL}/api/admin/drivers`, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            const drivers : DriverData[] = response.data.data;
            return drivers;
        } catch (error) {
            handleApiError(error);
        }
    },
    postDriver: async (formData: DriverForm, accessToken: string) => {
        try {
            const response = await axios.post<PostDriverResponse>(`${BASE_URL}/api/admin/driver`, formData, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    putDriver: async (formData:Pick<DriverForm, "name" | "email" | "telephone" | "address" |"city">, idDriver : string, accessToken : string) => {
        try {
            const response = await axios.put<PostDriverResponse>(`${BASE_URL}/api/admin/driver/${idDriver}`, formData, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    deleteDriver: async ( idDriver : string, accessToken : string) => {
        try {
            const response = await axios.delete<PostDriverResponse>(`${BASE_URL}/api/admin/driver/${idDriver}`, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    assignDriver : async (idOrder:string, idDriver:string, accessToken:string) => {
        try {
            const response = await axios.post<PostDriverResponse>(`${BASE_URL}/api/admin/order/${idOrder}/driver/${idDriver}`, {} , {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            await axios.post(`${BASE_URL}/api/admin/order/${idOrder}/driver/${idDriver}`,{}, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
        
    },
    removeAssignDriver : async (idOrder:string, accessToken:string) => {
        try {
            const response = await axios.delete<PostDriverResponse>(`${BASE_URL}/api/admin/order/${idOrder}/driver`,  {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
        
    },
}

export default driverService;
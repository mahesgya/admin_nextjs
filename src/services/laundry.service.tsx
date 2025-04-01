import { handleApiError } from "@/lib/errorHandle";
import { LaundryResponses, LaundryPartnerForm, LaundryData, PostLaundryResponse } from "@/types/laundry";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const laundryService = {
    getLaundries : async (accessToken:string) => {
        try {
            const response = await axios.get<LaundryResponses>(`${BASE_URL}/api/admin/laundry_partners`, {
                headers: {Authorization: `Bearer ${accessToken}`},
            })

            const laundries : LaundryData[] = response.data.data;
            return laundries;
        } catch (error) {
            handleApiError(error)
        }
    },
    postLaundry: async (formData: LaundryPartnerForm, accessToken:string) => {
        try {
            const response = await axios.post<PostLaundryResponse>(`${BASE_URL}/api/admin/laundry_partner`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            return response.data;
        } catch (error) {   
            handleApiError(error);
        }
    },
    putLaundry: async (formData: Pick<LaundryPartnerForm, "email" | "name" | "description" | "telephone" | "address" | "maps_pinpoint" | "city" | "area">, idLaundry : string, accessToken : string ) => {
        try {
            const response = await axios.put<PostLaundryResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}`, formData, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            return response.data;
        } catch (error) {
            handleApiError(error)
        }
    },
    deleteLaundry: async (idLaundry : string, accessToken : string ) => {
        try {
            const response = await axios.delete<PostLaundryResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}`,{
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            return response.data;
        } catch (error) {
            handleApiError(error)
        }
    }
}

export default laundryService;
import { handleApiError } from "@/lib/errorHandle";
import { PackageData, PackageForm, PackageResponses, PostPackageResponse, PackageSingleResponse } from "@/types/package";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const packageService = {
    getPackageById: async (idLaundry:string, idPackage:string, accessToken:string) => {
        try {
            const response = await axios.get<PackageSingleResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package/${idPackage}`,{
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            return response.data.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    getPackageByLaundry: async (idLaundry:string, accessToken:string) => {
        try {
            const response = await axios.get<PackageResponses>(`${BASE_URL}/api/laundry_partner/${idLaundry}`,{
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            const packages: PackageData = response.data.data
            return packages;
        } catch (error) {
            handleApiError(error);
        }
    },
    postPackage: async (formData : PackageForm,  idLaundry : string, accessToken : string) => {
        try {
            const response = await axios.post<PostPackageResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package`, formData, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    putPackage: async (formData: Pick<PackageForm, "name" | "description" | "price_text" | "features">, idLaundry : string, idPackage : string, accessToken : string) => {
        try {
            const response = await axios.put<PostPackageResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package/${idPackage}`, formData, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data
        } catch (error) {
            handleApiError(error);
        }
    },
    deletePackage: async ( idLaundry : string, idPackage : string, accessToken : string) => {
        try {
            const response = await axios.delete<PostPackageResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/package/${idPackage}`, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default packageService;
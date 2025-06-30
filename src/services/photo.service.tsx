import axios from "axios"
import { handleApiError } from "@/lib/errorHandle"
import { PhotoData, PhotoResponse, PostPhotoResponse } from "@/types/photo";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const photoService = {
    getPhotos: async (idLaundry:string) => {
        try {
            const response = await axios.get<PhotoResponse>(`${BASE_URL}/api/laundry_partner/${idLaundry}/images`);
            const photos : PhotoData[] = response.data.data;

            return photos;
        } catch (error) {
            handleApiError(error);
        }
    },
    postPhoto: async (formData: FormData, idLaundry : string, accessToken : string) => {
        try {
            const response = await axios.post<PostPhotoResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/image`, formData, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    deletePhoto: async (idPhoto: string,  idLaundry : string, accessToken : string) => {
        try {
            const response = await axios.delete<PostPhotoResponse>(`${BASE_URL}/api/admin/laundry_partner/${idLaundry}/image/${idPhoto}`, {
                headers : {Authorization : `Bearer ${accessToken}`},
            })

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

}

export default photoService;
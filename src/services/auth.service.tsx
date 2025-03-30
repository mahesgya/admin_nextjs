import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginResponse { 
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

const authService = {
    loginAdmin: async (email:string, password:string) => {
        try {
            const response = await axios.post<LoginResponse>(`${BASE_URL}/api/admin/login`,{
                email, 
                password,
            })
            const {accessToken, refreshToken} = response.data.data;
            Cookies.set("accessToken", accessToken, {secure: true, sameSite: "none", expires: 1});
            Cookies.set("refreshToken", refreshToken, {secure: true, sameSite: "none", expires: 7});
            return response.data;
        } catch (error) {
           throw error;
        }
    }
}

export default authService;
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
            handleApiError(error);
        }
    },
    logoutAdmin: async (refreshToken:string) => {
        try {
            const response = await axios.post<LogoutResponse>(`${BASE_URL}/api/customer/logout`, {
                refresh_token: refreshToken,
            })

            Cookies.remove("refreshToken");
            Cookies.remove("accessToken");
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
    refreshAdmin: async (oldRefreshToken:string) => {
        try {
            const response = await axios.put<RefreshResponse>(`${BASE_URL}/api/auth`,{
                refresh_token : oldRefreshToken,
            })

            const {accessToken, refreshToken} = response.data.data;
            Cookies.set("accessToken", accessToken, {secure: true, sameSite: "none", expires: 1});
            Cookies.set("refreshToken", refreshToken, {secure: true, sameSite: "none", expires: 7});

            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }
}

export default authService;
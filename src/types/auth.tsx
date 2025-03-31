export interface LoginResponse { 
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface LogoutResponse{ 
    success: boolean;
    data: string;
}

export interface RefreshResponse{
    data: {
        accessToken: string;
        refreshToken: string;
    };
}





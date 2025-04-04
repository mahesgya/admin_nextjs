export interface LoginResponse {
    success : boolean, 
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
    success : boolean,
    data: {
        accessToken: string;
        refreshToken: string;
    };
}





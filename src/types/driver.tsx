interface BaseDriver{
    name : string;
    email : string;
    telephone : string;
}

export interface DriverForm extends BaseDriver{
    password : string;
    confirm_password: string;
    address : string;
    city : string;
}

export interface DriverData extends BaseDriver{
    id : string;
    address : string;
    city : string;
    created_at : string;
    updated_at : string;
}

export interface DriverResponse{
    success : boolean;
    data : DriverData[];
}

export interface PostDriverResponse{ 
    success: boolean;
    data: string;
}


export interface DriverOrder{
    id : string | null;
    name : string | null;
    email : string | null;
    telephone : string | null;
}
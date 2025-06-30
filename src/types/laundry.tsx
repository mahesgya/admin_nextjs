interface BaseLaundry{
    name : string;
    email : string;
    address : string;
    city : string;
    area : string;
    telephone : string;
    maps_pinpoint: string;
}

export interface LaundryPartnerForm extends BaseLaundry{
    description : string;
    password : string;
    confirm_password : string;
    latitude : number;
    longitude : number;
}

export interface LaundryPartners extends BaseLaundry{
    id: string;
}

export interface LaundryData extends LaundryPartners{
    description : string;
    latitude : string;
    longitude : string;
    created_at : string;
    updated_at : string;
}

export interface LaundryResponses{
    success: boolean;
    data : LaundryData[];
}


export interface PostLaundryResponse{ 
    success: boolean;
    data: string;
}
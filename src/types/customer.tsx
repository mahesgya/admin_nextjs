export interface Customer {
    id: string;
    name: string;
    email: string;
    address: string;
    telephone: string;
}

export interface CustomerData extends Customer{
    referral_code : string | null;
    created_at : string;
    updated_at : string;
    referral_code_use : number;
}

export interface CustomerResponses{
    success : boolean;
    data : CustomerData[];
}

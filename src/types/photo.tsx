export interface PhotoData{
    id: string;
    laundry_partner_id: string;
    filepath : string;
}

export interface PhotoResponse{
    success: boolean;
    data: PhotoData[];
}

export interface PostPhotoResponse{ 
    success: boolean;
    data: string;
}
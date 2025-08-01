export interface BasePackage {
  name: string;
  description: string;
  price_text: string;
  features: string[];
}

export interface Package extends BasePackage {
  id: string;
}

export interface SinglePackage {
  id: string;
  name: string;
  description: string;
  price_text: string;
  features: string;
}

export interface PackageData {
  id: string;
  name: string;
  email: string;
  description: string;
  telephone: string;
  address: string;
  city: string;
  area: string;
  maps_pinpoint: string;
  latitude: string;
  longitude: string;
  created_at: string;
  updated_at: string;
  is_active: number;
  is_open: number;
  packages: Package[];
}

export interface PackageForm{
  name: string;
  description: string;
  price_text: string;
  features: string;
}

export interface PackageResponses {
  success: boolean;
  data: PackageData;
}

export interface PackageSingleResponse {
  success: boolean;
  data: SinglePackage;
}

export interface PostPackageResponse{ 
  success: boolean;
  data: string;
}

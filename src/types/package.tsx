export interface BasePackage {
  name: string;
  description: string;
  price_text: string;
}

export interface Package extends BasePackage {
  id: string;
}

export interface PackageForm extends BasePackage {
  features: string;
}

export interface PackageData extends PackageForm {
  id: string;
}

export interface PackageResponses {
  success: boolean;
  data: PackageData;
}

export interface PostPackageResponse{ 
  success: boolean;
  data: string;
}
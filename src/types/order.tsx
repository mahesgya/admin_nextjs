import { Customer} from "./customer";
import { LaundryPartners } from "./laundry";
import { DriverOrder } from "./driver";
import { Package } from "./package";

export interface Orders {
    id: string;
    content: string;
    status: string;
    status_payment: string;
    maps_pinpoint: string;
    weight: string;
    price: string;
    price_after: string;
    coupon_code: string | null;
    referral_code: string | null;
    created_at: string;
    note: string;
    rating: number;
    review: string | null;
    pickup_date: string;
    customer: Customer;
    laundry_partner: LaundryPartners;
    package : Package;
    driver : DriverOrder;

}

export interface OrderResponses {
    success: boolean;
    data: Orders[];
}

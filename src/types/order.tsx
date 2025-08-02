import { Customer} from "./customer";
import { LaundryPartners } from "./laundry";
import { DriverOrder } from "./driver";
import { Package } from "./package";

export interface Coupon {
    name: string | null;
    multiplier: number | null;
    description: string | null;
    min_weight: number | null;
    max_discount: number | null;
}

export interface Orders {
    id: string;
    content: string;
    status: string;
    cancel_reason: string | null;
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
    payment_link: string | null;
    customer: Customer;
    coupon : Coupon;
    laundry_partner: LaundryPartners;
    package : Package;
    driver : DriverOrder;
}

export interface OrderResponses {
    success: boolean;
    data: Orders[];
}
export interface OrderSingleResponse {
    success: boolean;
    data: Orders;
}

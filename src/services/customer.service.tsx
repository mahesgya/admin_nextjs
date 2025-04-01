import { handleApiError } from "@/lib/errorHandle";
import { CustomerResponses } from "@/types/customer";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const customerService = {
  getCustomers: async (accessToken: string) => {
    try {
      const response = await axios.get<CustomerResponses>(`${BASE_URL}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default customerService;

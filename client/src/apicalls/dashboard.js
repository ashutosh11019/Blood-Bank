import { axiosInstance } from ".";

export const GetAllBloodGroupsInInventory = async () => {
    const response = await axiosInstance("get", "/api/dashboard/blood-group-data")
    return response
}

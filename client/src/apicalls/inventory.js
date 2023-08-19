import { axiosInstance } from ".";

export const AddInventory = async (payload) => {
    const response = await axiosInstance("post", "/api/inventory/add", payload)
    // console.log(response)
    return response
}


export const GetInventory = async () => {
    const response = await axiosInstance("get", "/api/inventory/get")
    return response
}


export const GetInventoryWithFilter = (filters, limit) => {
    const response = axiosInstance("post", "/api/inventory/filter", { filters, limit })
    return response
}
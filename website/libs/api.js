import {ChooseService} from "./lib";
import {apiErrorHandler, axiosPublic} from "./axios";
import toast from "react-hot-toast";

export const GetLinkInfo = async (link) => {
    const {service} = ChooseService(link);
    switch (service) {
        case "ARABSEED":
            return await FetchInfo("arabseed", link);

        case "NEW_AKOAM":
            return await FetchInfo("akoam", link);

        case "OLD_AKOAM":
            return await FetchInfo("akoam/old", link);


        default:
            break;
    }

};

const FetchInfo = async (path, link) => {
    try {
        const {data, status} = await axiosPublic.post(`/${path}`, {link});

        if (status === 201) return data;
        return toast.error("حصلت مشكلة، جرب تعمل ريفريش")
    } catch (error) {
        return apiErrorHandler(error)
    }


};


export const SendOperationStartSignal = async (path, id) => {
    try {
        const {status, data} = await axiosPublic.post(`/${path}/start`, {id});
        if (status === 201) return {data, status};
        return toast.error("حصلت مشكلة، جرب تعمل ريفريش")

    } catch (error) {
        return apiErrorHandler(error)
    }

};


export const SearchByOperationId = async (id) => {

    try {
        const {data,status} = await axiosPublic.get(`/search/${id}`)
        return {data, status};

    } catch (error) {
        return apiErrorHandler(error)
    }
}
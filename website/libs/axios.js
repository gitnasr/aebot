import axios from 'axios';
import toast from "react-hot-toast";

let BASE_URL = process.env.NODE_ENV === "production" ? 'https://aebot.onrender.com' : "http://127.0.0.1:5001";

export const axiosPublic =  axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});


export const apiErrorHandler = (e) => {
    if (e.response.data.code === 401 ||e.response.data.code === 400 || e.response.data.code === 404) {
        toast.error(e.response.data.message,{position:"bottom-center"})
        return  {status:400}
    }
       toast.error("Something went error while handle this request")
    return  {status:500}
}

export const fetcher = async (url) => {
    const res = await fetch(BASE_URL + url);

    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        // Attach extra info to the error object.
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
};
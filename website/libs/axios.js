import axios from 'axios';
import toast from "react-hot-toast";

let BASE_URL = process.env.NODE_ENV === "production" ? 'https://aemedia.herokuapp.com' : "http://127.0.0.1:5001";

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


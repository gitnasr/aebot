import { ChooseService } from "./lib";
import axios from "axios";
import { toast } from "react-toastify";

const API_LINK = "https://aemedia.herokuapp.com/";
export const fetch_info = async (link) => {
  const { service } = ChooseService(link);
    let data
  switch (service) {
    case "ARABSEED":
      data = await fetch_info_req("arabseed",link);
      if (data) return data;
      return toast.error("Something Went Error..!");
    case "NEW_AKOAM":
      data = await fetch_info_req("akoam",link);
      if (data) return data;
      return toast.error("Something Went Error..!");
    case "OLD_AKOAM":
      data = await fetch_info_req("akoam/old",link);
      if (data) return data;
      return toast.error("Something Went Error..!");

    default:
      break;
  }

};

const fetch_info_req = async (path,link) => {
  const { data } = await axios.post(`${API_LINK}${path}`,{link});
  if (data.error) return false;
  data.service = path
  return data;
};


export const start_operation = async (path,id) => {
    try {
        const { data } = await axios.post(`${API_LINK}${path}`,{id});
        if (data.error) return false;
        return data.id;
    } catch (error) {
        return false
    }
  
  };
  
export const AkoamSearch = async (id) => { 

    try {
        const {data} = await axios.post(`${API_LINK}akoam/search`,{id})
        if (data.error) return false;
        return data.result;
    } catch (error) {
        return false
    }
}

export const ArabseedSearch = async (id) => { 

    try {
        const {data} = await axios.post(`${API_LINK}arabseed/search`,{id})
        if (data.error) return false;
        return data.result;
    } catch (error) {
        return false
    }
}


export const SearchByOperationId = async (id) => { 

    try {
        const {data} = await axios.post(`${API_LINK}search`,{id})
        if (data.error) return false;
        return {result:data.result,service:data.service};
    } catch (error) {
        return false
    }
}
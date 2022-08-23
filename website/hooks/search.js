import useSWR from "swr";
import {fetcher} from "../libs/axios";

export const useSearchByOperationId = (key,opt = {}) => {
	const { data, error } = useSWR(key, fetcher,opt);
	return {
		data,
		isLoading: !error && !data,
		isError: error,
		key,
	};

}
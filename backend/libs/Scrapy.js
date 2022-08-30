const Scrapy = require("../models/scrapy");
const axios = require("axios");
const cheerio = require("cheerio");
const axiosRetry = require("axios-retry");
const ApiError = require("../utils/ApiError");

exports.useUpdateStatus = (status, id, isError = false) => {
	const update = {
		isError, isProcessing: !isError, status
	}
	return Scrapy.findByIdAndUpdate(id, update)
}

exports.SendRequestByProxy = async (link, method = "GET", payload = {}, headers = {}) => {

	const {data} = await axios({
		baseURL: `https://desolate-escarpment-25251.herokuapp.com/?url=${link}`, data: payload, headers, method
	})
	return cheerio.load(data);
}

exports.SendRequestByAxios = async (link, method = "GET", payload = {}, headers = {}) => {
	try {
		axiosRetry(axios, {
			retries: 3, onRetry: (retryCount, error, requestConfig) => {
				console.log(retryCount, error, requestConfig)

			}
		});

		const {data} = await axios({
			baseURL: encodeURI(link), data: payload, headers, method
		})
		return cheerio.load(data);

	} catch (e) {
		return new ApiError(e.message, e.status);
	}


}
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

exports.SendRequestByCookiesSaver = () =>{
	const jar = new CookieJar();

	return wrapper(axios.create({jar}));
}
exports.findByQuality = (q, link) => {
	return Scrapy.findOne({quality: q, link,})
}
exports.savePrimesByQuality = (id, primes) => {
	return Scrapy.findByIdAndUpdate(id, {'info.prime': primes}, {new: true})
}
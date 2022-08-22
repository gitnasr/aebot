const Scrapy = require("../models/scrapy");
const {default: axios} = require("axios");
const config = require("../config/config");
const cheerio = require("cheerio");
const axiosRetry = require("axios-retry");
exports.useUpdateStatus = (status,id,isError=false) => {
    const update = {
        isError,
        isProcessing: !isError,status
    }
    return Scrapy.findByIdAndUpdate(id, update)
}

exports.SendRequestByProxy = async (link,method="GET",payload={},headers ={}) => {

    const {data} = await axios({
        baseURL:`${config.PROXY_API}${link}`,
        data:payload,
        headers,
        method
    })
    return cheerio.load(data);
}

exports.SendRequestByAxios = async (link,method="GET",payload={},headers ={}) =>{
    axiosRetry(axios, { retries: 10 });
    const {data} = await axios({
        baseURL:encodeURI(link),
        data:payload,
        headers,
        method
    })

    return cheerio.load(data);
}
exports.findByQuality = (q,link) => {
    return Scrapy.findOne({quality:q,link,})
}
exports.savePrimesByQuality = (id,primes) => {
    return Scrapy.findByIdAndUpdate(id,{'info.prime':primes},{new:true})
}
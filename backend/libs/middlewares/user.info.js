const { IPinfoWrapper, LruCache} = require("node-ipinfo");
const config = require("./../../config/config");
const cacheOptions = {
    max: 5000,
    maxAge: 24 * 1000 * 60 * 60,
};
const cache = new LruCache(cacheOptions);
const ipinfo = new IPinfoWrapper(config.IP,cache);

exports.InfoAndSourceRecorder = async (req,res,next) => {
    let userIp = req.clientIp

    if (config.env === "development") userIp = "127.0.0.1"
    const userIpInfo =  await ipinfo.lookupIp(userIp);

    const source =  req.source = Object.keys(req.useragent).reduce((p, c) => {
        if (req.useragent[c]) p[c] = req.useragent[c];
        return p;
    }, {})

    req.ip = userIp
    req.ipInfo = userIpInfo
    req.source = source

    next()

}


const {isValidHttpUrl} = require("./helpers/is.url");
const qs = require("qs");
const {useUpdateStatus, SendRequestByProxy, savePrimesByQuality, findByQuality, SendRequestByAxios,
    SendRequestByCookiesSaver
} = require("./Scrapy");
const axios = require("axios");
const cheerio = require("cheerio");

const GetArabseedEpisodesLinks = (html) => {
    const episodes_links = []

    const $ = html

    const title = $(".Title").contents()[0].data;
    const poster = $(".Poster").children("img")[0].attribs.src;
    const story = $(".descrip")[0].children[0]?.data;
    const episodes = $(".ContainerEpisodesList").children()
    episodes.each((e, i) => {
        if (isValidHttpUrl(i.attribs.href)){
            episodes_links.push(i.attribs.href + "/download/");

        }

    })
    const data = {
        episodes_links:episodes_links
    }
    return {info:data,episodes,title,poster,story,service:"arabseed"}

}



const GetArabseedDownloadLinks = async (episodes_links,quality,link,id) => {
    const Primes = await findByQuality(quality,link)
    if (!Primes.info?.prime){
        const PrimeDownloadLinks = []
        for (let i = 0; i < episodes_links.length; i++) {
            const download_link = episodes_links[i];
            const html = await SendRequestByProxy(download_link)

            const available_quality = html(".download-items")


            let selected_quality = quality
            let primeDownloadLink
            primeDownloadLink = html("a.downloadsLink.ArabSeedServer")[0].attribs.href;

            // if (available_quality.length < selected_quality) {
            //     primeDownloadLink = html("a.downloadsLink.ArabSeedServer")[0].attribs.href;
            // }else{
            //     primeDownloadLink = available_quality[selected_quality].children.map(node => {
            //         if (node && node['attribs'] && node['attribs']['class'] === "downloadsLink HoverBefore ArabSeedServer" && !node['attribs']['href'].includes("/l/")){
            //             return node['attribs']['href']
            //         }
            //     }).filter(nodes => nodes)[0]
            // }

            PrimeDownloadLinks.push(primeDownloadLink)

            await useUpdateStatus(`كود1: الحلقة رقم #${i+1}`,id)

        }
       await savePrimesByQuality(id,PrimeDownloadLinks)
        return PrimeDownloadLinks

    }
    await useUpdateStatus(`كود1: تم بنجاح `)

    return Primes.info.prime

}
const SkipCountdown = async (PrimeDownloadLinks,id) => {
    const ArabseedServerLinks = []
    const expression = /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
    const client = SendRequestByCookiesSaver()
    for (let i = 0; i < PrimeDownloadLinks.length; i++) {
            const Link = PrimeDownloadLinks[i];
            const {data} = await client.get(Link,{
                headers: {
                    "referer":"https://m.arabseed.sbs/"
                }
            })
            const shorted_link = data.match(expression)[0]
            const {data:ShortedLink} = await client.get(shorted_link)
            const $ = cheerio.load(ShortedLink)
            let server_link = $(".downloadbtn")[0].attribs.href;

            ArabseedServerLinks.push(server_link)
        await useUpdateStatus(`كود2: الحلقة رقم #${i+1}`,id)


    }
    await useUpdateStatus(`كود2: تم بنجاح `)

    return ArabseedServerLinks
}

const GetServerDownloadLinks = async (PrimeDownloadLinks,id) => {
    const client = SendRequestByCookiesSaver()

    const final_links = []
    for (let i = 0; i < PrimeDownloadLinks.length; i++) {
        const Hashed = PrimeDownloadLinks[i];

        let hash = Hashed.split("/")[3];

        let payload = qs.stringify({
            op: "download2",
            id: hash,
            rand: "",
            method_free: "",
            method_premium: "",
            referer:""
        });

        const {data} = await client.post(Hashed,payload, {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        });
        const $ = cheerio.load(data)
        let final_link = $(".download-button").children("a")[0].attribs.href;

        final_links.push(final_link);
        await useUpdateStatus(`كود3: الحلقة رقم #${i+1}`,id)

    }
    await useUpdateStatus(`كود3: تم بنجاح `)

    return final_links
}
module.exports = {GetArabseedEpisodesLinks,SendRequestByProxy,GetArabseedDownloadLinks,GetServerDownloadLinks,SkipCountdown}
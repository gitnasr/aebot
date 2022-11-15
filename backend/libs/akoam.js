const { default: axios } = require("axios");
const { isValidHttpUrl } = require("./helpers/is.url");
const {useUpdateStatus, SendRequestByAxios} = require("./Scrapy");


exports.AkwamNewInfoFetcher = async (link) => {
    try {
        const html = await SendRequestByAxios(link)
        let domain = (new URL(link)).hostname;

        const title = html("h1")?.text();
        const poster = html(
            ".col-lg-3, col-md-4 text-center mb-5 mb-md-0"
        ).children()[0]?.attribs.href;

        const episodes = html(".entry-date").length;

        const story = html("p")[0]?.children[0]?.data;

        return {title,poster,episodes,story,domain}
    }catch (e) {
        console.log(e)
        return  {}
    }


}



exports.AkwamNewGetEpisodesLinks = async (link, id) => {
    const episodes_links = [];
    const html =await SendRequestByAxios(link)

    html("div.col-md-auto, text-center pb-3 pb-md-0")
        .children()
        .each(async (i, r) => {
          if (isValidHttpUrl(r.attribs.href)) {
                episodes_links.push(r.attribs.href);
                await useUpdateStatus(`لينكات الحلقات: الحلقه رقم #${i+1}`,id)

          }
        });

    return episodes_links;


};

exports.AkwamNewGetShortedLinks = async (episodes_links, id) => {
  const Shorted = [];

  for (let i = 0; i < episodes_links.length; i++) {
      const link = episodes_links[i];
      const html = await SendRequestByAxios(link)

      const shorted = html( "a.link-btn, link-download d-flex align-items-center px-3" )[1].attribs.href;
      if (isValidHttpUrl(shorted)){
          Shorted.push(shorted);
          await useUpdateStatus(`لينكات التحميل الاولية: الحلقه رقم #${i+1}`,id)

      }

  }
    return Shorted;
};

exports.AkwamNewGetPreDirectLinks = async (Shorted, id) => {

  const PreDirects = [];

  for (let i = 0; i < Shorted.length; i++) {
    const link = Shorted[i];
    const html = await SendRequestByAxios(link)

    const preDirect = html(".download-link").map((i, x) => html(x).attr("href"))[0];

    if (isValidHttpUrl(preDirect)) PreDirects.push(preDirect);
    await useUpdateStatus(`لينكات التحميل ما قبل الاخيرة: الحلقه رقم #${i+1}`,id)
  }
  return PreDirects;
};

exports.AkwamNewGetDirectLinks = async (PreDirects, id) => {

  const DirectLinks = [];

  for (let i = 0; i < PreDirects.length; i++) {
    const link = PreDirects[i];
      const html = await SendRequestByAxios(link)

      html(".btn-loader")
      .children()
      .each((i, r) => {
        if (isValidHttpUrl(r.attribs.href)) DirectLinks.push(r.attribs.href);
      });
    await useUpdateStatus(`لينكات التحميل الاخيرة: الحلقه رقم #${i+1}`,id)
  }
  return DirectLinks;
};
// =====================================================================================================================


exports.AkwamOldGetInfo = async (link) => {
    const html = await SendRequestByAxios(link)
    const title = html(".sub_title").find("h1").text().trim();
    const poster = html(".main_img")[0].attribs.src;
    const episodes = html(".akoam-buttons-group").length;
    const story = "القصه غير متوفره في الوقت الحالي";
    let domain = (new URL(link)).hostname;

    return {
        title,
        poster,
        episodes,
        story,
        domain
    }
}

exports.AkwamOldGetEpisodesLink = async (link) => {
    const Episodes_Links = []
    const html = await SendRequestByAxios(link)
    html(".akoam-buttons-group")
        .find("a")
        .each((e, i) => {
            Episodes_Links.push(i.attribs.href)});

    return [...new Set(Episodes_Links)];
}
exports.AkwamOldGetPreDirectLinks = async (shorted_links,id) => {
    const preDirect = []
    for (let index = 0; index < shorted_links.length; index++) {
        const progress = (((index + 1) / shorted_links.length) * 100).toFixed(1)

        const link = shorted_links[index]

        const {data,headers} = await axios.get(link);
        const decoded_cookies = JSON.parse(decodeURIComponent(headers['set-cookie'][0].split(';')[0].split('=')[1]))
        const link_from_cookies = decoded_cookies['route']

        preDirect.push(link_from_cookies);
        await useUpdateStatus(`تم اتجاز: %${progress} كود 3:`, id)
    }
    return preDirect
}
exports.AkwamOldGetDirectLinks = async (episodes,id) => {
    const DirectLinks = []
    for (let index = 0; index < episodes.length; index++) {
        const progress = (((index + 1) / episodes.length) * 100).toFixed(1)

        const link = episodes[index]

        const {data} = await axios.post(link, null, {
            headers: {"x-requested-with": "XMLHttpRequest", referer: link},
        });
        DirectLinks.push(data.direct_link);
        await useUpdateStatus(`تم اتجاز: %${progress}`, id)
    }
    return DirectLinks
}
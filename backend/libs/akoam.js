const { default: axios } = require("axios");
const cheerio = require("cheerio");
const { isValidHttpUrl } = require("./helpers/is.url");
const {useUpdateStatus} = require("./Scrapy");

exports.phase_1 = async (link, id) => {
    const episodes_links = [];
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    $("div.col-md-auto, text-center pb-3 pb-md-0")
        .children()
        .each(async (i, r) => {
          if (isValidHttpUrl(r.attribs.href)) {
            episodes_links.push(r.attribs.href);
            await useUpdateStatus(`لينكات الحلقات: الحلقه رقم #${i+1}`,id)

          }
        });

    return episodes_links;


};

exports.phase_2 = async (episodes_links, id) => {
  const phase_2_link = [];

  for (let i = 0; i < episodes_links.length; i++) {
      const link = episodes_links[i];
      const { data } = await axios.get(encodeURI(link));
      const $ = cheerio.load(data);

      const phase_2 = $(
        "a.link-btn, link-download d-flex align-items-center px-3"
      )[1].attribs.href;
      if (isValidHttpUrl(phase_2)){
        phase_2_link.push(phase_2);
        await useUpdateStatus(`لينكات التحميل الاولية: الحلقه رقم #${i+1}`,id)

      }

  }
    return phase_2_link;
};

exports.phase_3 = async (phase_2_links, id) => {

  const phase_3_link = [];

  for (let i = 0; i < phase_2_links.length; i++) {
    const link = phase_2_links[i];
    const { data } = await axios.get(encodeURI(link));
    const $ = cheerio.load(data);

    const phase_3 = $(".download-link").map((i, x) => $(x).attr("href"))[0];

    if (isValidHttpUrl(phase_3)) phase_3_link.push(phase_3);
    await useUpdateStatus(`لينكات التحميل ما قبل الاخيرة: الحلقه رقم #${i+1}`,id)
  }
  return phase_3_link;
};

exports.phase_4 = async (phase_3_links, id) => {

  const phase_4_link = [];

  for (let i = 0; i < phase_3_links.length; i++) {
    const link = phase_3_links[i];
    const { data } = await axios.get(encodeURI(link));
    const $ = cheerio.load(data);

    $(".btn-loader")
      .children()
      .each((i, r) => {
        if (isValidHttpUrl(r.attribs.href)) phase_4_link.push(r.attribs.href);
      });
    await useUpdateStatus(`لينكات التحميل الاخيرة: الحلقه رقم #${i+1}`,id)
  }
  return phase_4_link;
};

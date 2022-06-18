const { default: axios } = require("axios");
const cheerio = require("cheerio");
const Arabseed = require("../models/arabseed");
const Queue = require("bull");
const qs = require("qs");
const { randomBytes } = require("crypto");
const { RedisClient } = require("../libs/redis");
const Socket = require("../libs/Socket");
const {isValidHttpUrl} = require("../libs/helpers/is.url")
const Redis = RedisClient();
const Scrapy = require("../models/scrapy");
const config = require("../config/config");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
exports.SearchByOperationId = catchAsync(async (req, res) => {
  const { id } = req.body;

  const isExisted = await Scrapy.findOne({ operation: id }).select("-user");
  if (!isExisted) return res.sendStatus(httpStatus.NO_CONTENT);
  return res.json(isExisted);
})

exports.InfoFetcher = async (req, res) => {
  try {
 
    const { link } = req.body;
    const page = await axios.get(`${config.PROXY_API}${link}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Mobile Safari/537.36",
      },
    });


    const $ = cheerio.load(page.data);

    const title = $(".Title").contents()[0].data;
    const poster = $(".Poster").children("img")[0].attribs.src;
    const story = $(".descrip")[0].children[0]?.data;
    const episodes = $(".ContainerEpisodesList").children().length;



    const newArabseed = await Scrapy.create({
      link,
      title,
      poster,
      episodes,
      story,
      user: {
        ip:req.ip,
        info:req.ipInfo,
        source:req.source
      },
      service:"arabseed"
    });

    return res
      .status(201)
      .json({ link, title, poster, episodes, story, id: newArabseed._id });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
exports.StartScrapper = async (req, res) => {
  const socket = new Socket();

  try {
    const { id } = req.body;
    const isExisted = await Arabseed.findById(id);
    if (!isExisted || isExisted.operation) return res.sendStatus(404);
    const operation_id = "N" + randomBytes(7).toString("hex");
    const q = new Queue("arabseed", Redis);
    q.add(
      { db: id , db_data:isExisted},
      {
        jobId: operation_id,
        attempts: isExisted.episodes,
        backoff: { type: "fixed", delay: 1000 },
      }
    );

    q.process(async (job, done) => {
      const final_links = [];

    
      const start = Date.now();

        const { db_data } = job.data;
        const page = await axios.get(`${process.env.API_PROXY}${db_data.link}`);
        const $ = cheerio.load(page.data);
        const episodes_links = [];
        $("div.ContainerEpisodesList")
          .children()
          .each((e, i) => {
            console.log(i.attribs.href)
            if (isValidHttpUrl(i.attribs.href) && !undefined){
              episodes_links.push(i.attribs.href + "/download/");
              socket.sendMessage("phase", {
                id: job.id,
                status: `Phase 1: Episode ${e + 1}`,
              });
            }
         
          });
          socket.sendMessage("phase", {
            id: job.id,
            status: `Starting Phase #2`
          });

        const download_links = [];

        for (let i = 0; i < episodes_links.length; i++) {
          const download_link = episodes_links[i];
          
          const { data } = await axios.get(`${process.env.API_PROXY}${download_link}`);
          console.log(`Phase 2: Episode ${i + 1}`);
          const $ = cheerio.load(data);

          const phase_2 = $("a.downloadsLink")[0].attribs.href;
          download_links.push(phase_2);
          socket.sendMessage("phase", {
            id: job.id,
            status: `Phase 2: Episode ${i + 1}`,
          });
        }

        for (let i = 0; i < download_links.length; i++) {
          const direct_link = download_links[i];

          let token = direct_link.split("/")[3];

          let payload = qs.stringify({
            op: "download2",
            id: token,
            rand: "",
            referer: "https://arabseed.ws/",
            method_free: "",
            method_premium: "",
          });
          
          const { data } = await axios.post(`${process.env.API_PROXY}${direct_link}`, payload, {
            headers: {
              "content-type": "application/x-www-form-urlencoded",
            },
          });
          const $ = cheerio.load(data);
          console.log(`Phase 3: Episode ${i + 1}`);

          let final_link = $("#direct_link").children("a")[0].attribs.href;

          final_links.push(final_link);
          socket.sendMessage("phase", {
            id: job.id,
            status: `Phase 3: Episode ${i + 1}`,
          });
        }
        const end = Date.now();
        const time = (end - start) / 1000;
        await Arabseed.findByIdAndUpdate(job.data.db, {
          operation: job.id,
          result: {
            direct_links: final_links,
            time,
          },
          episodes:final_links.length
        });
        socket.sendMessage("Done", { id: job.id });

        done(null, { final_links, time });
      
    });

    return res.json({ id: operation_id });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

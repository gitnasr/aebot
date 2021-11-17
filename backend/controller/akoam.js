const { randomBytes } = require("crypto");
const { default: axios } = require("axios");
const cheerio = require("cheerio");
const { phase_1, phase_2, phase_3, phase_4 } = require("../libs/akoam");
const Akoam = require("../models/akoam");
const { get_ip_info } = require("../libs/helpers/ip");
const Queue = require("bull");
const { RedisClient } = require("../libs/redis");
const Socket = require("../libs/Socket");

const Redis = RedisClient();

exports.SearchByOperationId = async (req, res) => {
  try {
    const { id } = req.body;

    const isExisted = await Akoam.findOne({ operation: id }).select("-user");
    if (!isExisted) return res.sendStatus(404);
    return res.json({ result: isExisted });
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
};
exports.InfoFetcher = async (req, res) => {
  try {
    const { link } = req.body;

    const page = await axios.get(link);

    const $ = cheerio.load(page.data);

    const title = $("h1")?.text();
    const poster = $(
      ".col-lg-3, col-md-4 text-center mb-5 mb-md-0"
    ).children()[0]?.attribs.href;

    const episodes = $(".entry-date").length;

    const story = $("p")[0]?.children[0]?.data;

    const user_ip = await get_ip_info(req);

    let user_info = {};

    user_info.ip = user_ip;

    const newAkoam = await Akoam.create({
      link,
      title,
      poster,
      episodes,
      story,
      user: user_info,
    });

    return res
      .status(201)
      .json({ link, title, poster, episodes, story, id: newAkoam._id });
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
};

exports.StartScrapper = async (req, res) => {
  try {
    const socket = new Socket();

    const { id } = req.body;
    const isExisted = await Akoam.findById(id);
    if (!isExisted) return res.sendStatus(404);
    const operation_id = "N"+randomBytes(7).toString("hex");
    const q = new Queue("akoam:new", Redis);
    q.add({db:id}, { jobId: operation_id });
    q.process(2, async function (job, done) {
      const start = Date.now();
      socket.sendMessage("Start", { id: job.id });
      const episodes_links = await phase_1(isExisted.link,job.id );
      if (episodes_links.length === 0) return res.sendStatus(400);
      const phase_2_result = await phase_2(episodes_links,job.id);
      if (phase_2_result.length === 0) return res.sendStatus(400);
      const phase_3_result = await phase_3(phase_2_result,job.id);
      if (phase_3_result.length === 0) return res.sendStatus(400);
      const direct_links = await phase_4(phase_3_result,job.id);
      const end = Date.now();
      const time = (end - start) / 1000;
      await Akoam.findOneAndUpdate(
        { _id: job.data.db },
        { operation: job.id, result: { direct_links, time } }
      );

      socket.sendMessage("Done", { id: job.id });
      done(null, { direct_links, time });
    });

    return res.status(201).json({ id: operation_id });
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
};

exports.OldInfoFetcher = async (req, res) => {
  try {
    const { link } = req.body;

    const page = await axios.get(link);

    const $ = cheerio.load(page.data);

    const title = $(".sub_title").find("h1").text().trim();
    const poster = $(".main_img")[0].attribs.src;
    const episodes = $(".akoam-buttons-group").length;
    const story = "القصه غير متوفره في الوقت الحالي";

    const user_ip = await get_ip_info(req);

    let user_info = {};

    user_info.ip = user_ip;

    const newAkoam = await Akoam.create({
      link,
      title,
      poster,
      episodes,
      story,
      user: user_info,
    });

    return res
      .status(201)
      .json({ link, title, poster, episodes, story, id: newAkoam._id });
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
};

exports.StartOldScrapper = async (req, res) => {
  try {
    const { id } = req.body;
    const isExisted = await Akoam.findById(id);
    if (!isExisted) return res.sendStatus(404);
    const operation_id = "N" + randomBytes(7).toString("hex");

    const page = await axios.get(isExisted.link);

    const $ = cheerio.load(page.data);

    const socket = new Socket();

    const q = new Queue("akoam:old", Redis);
    q.add({ db: id }, { jobId: operation_id });
    q.process(async function (job, done) {
      try {
        const start = Date.now();
        const episodes_links = [];
        const direct_links = [];
        $(".akoam-buttons-group")
          .find("a")
          .each((e, i) => episodes_links.push(i.attribs.href));
        let unique_episodes_links = [...new Set(episodes_links)];
        for (let index = 0; index < unique_episodes_links.length; index++) {
          socket.sendMessage("Progress", {
            p: (((index + 1) / unique_episodes_links.length) * 100).toFixed(1),
            id: job.id,
          });

          console.log(
            `Progress : ${(
              ((index + 1) / unique_episodes_links.length) *
              100
            ).toFixed(1)}`
          );
          const episode = unique_episodes_links[index];

          const { data } = await axios.post(episode, null, {
            headers: { "x-requested-with": "XMLHttpRequest", referer: episode },
          });

          direct_links.push(data.direct_link);
        }

        const end = Date.now();
        const time = (end - start) / 1000;

        await Akoam.findOneAndUpdate(
          { _id: job.data.db },
          { operation: job.id, result: { direct_links, time } }
        );

        socket.sendMessage("Done", { id: job.id });

        done(null, { direct_links, time });
      } catch (error) {
        console.error(error);
        done(error);
      }
    });

    return res.status(201).json({ id: operation_id });
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
};

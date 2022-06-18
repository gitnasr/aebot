const { randomBytes } = require("crypto");
const { default: axios } = require("axios");
const cheerio = require("cheerio");
const { phase_1, phase_2, phase_3, phase_4, } = require("../libs/akoam");
const Scrapy = require("../models/scrapy");
const Queue = require("bull");
const { RedisClient } = require("../libs/redis");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const {useUpdateStatus} = require("../libs/Scrapy");

const Redis = RedisClient();

exports.SearchByOperationId = async (req, res) => {
  try {
    const { id } = req.body;

    const isExisted = await Scrapy.findOne({ operation: id }).select("-user");
    console.log(isExisted)
    if (!isExisted) return res.sendStatus(404);
    return res.json({ result: isExisted });
  } catch (error) {
    console.error(error);

    return res.sendStatus(500);
  }
};
exports.InfoFetcher = catchAsync(async (req, res) => {
  const {link} = req.body;

  const page = await axios.get(encodeURI(link));

  const $ = cheerio.load(page.data);

  const title = $("h1")?.text();
  const poster = $(
      ".col-lg-3, col-md-4 text-center mb-5 mb-md-0"
  ).children()[0]?.attribs.href;

  const episodes = $(".entry-date").length;

  const story = $("p")[0]?.children[0]?.data;



  const newAkoam = await Scrapy.create({
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
  });

  return res
      .status(200)
      .json({link, title, poster, episodes, story, id: newAkoam._id});

})


exports.StartScrapper = catchAsync (async (req, res) => {
  const { id } = req.body;
  const isExisted = await Scrapy.findById(id);

  if (!isExisted) return res.sendStatus(httpStatus.NO_CONTENT)
  if (isExisted.operation) return res.json(isExisted);


  const operation_id = "N"+randomBytes(7).toString("hex");
  const q = new Queue("akoam:new", Redis);


  q.add({db:id,db_data:isExisted}, { jobId: operation_id });
  q.process(async (job, done) => {
    const docId = job.data.db_data._id


    try{


    const start = Date.now();

    const episodes_links = await phase_1(job.data.db_data.link,docId );
    if (episodes_links.length === 0) return useUpdateStatus("اممم مشكله في جلب لينكات الحلقات، ربما في مشكله في اكوام. حاول كمان شويه او كلمني عشان اعمل ابديت",docId)

    const phase_2_result = await phase_2(episodes_links,job.data.db_data._id);
    if (phase_2_result.length === 0)  return useUpdateStatus("اممم مشكله في جلب لينكات التحميل1، ربما في مشكله في اكوام. حاول كمان شويه او كلمني عشان اعمل ابديت",docId)

    const phase_3_result = await phase_3(phase_2_result,docId);
    if (phase_3_result.length === 0) return useUpdateStatus("اممم مشكله في جلب لينكات التحميل2، ربما في مشكله في اكوام. حاول كمان شويه او كلمني عشان اعمل ابديت",docId)

    const direct_links = await phase_4(phase_3_result,docId);

    const end = Date.now();
    const time = (end - start) / 1000;
    await Scrapy.findByIdAndUpdate(
        docId,
        { operation: job.id, result: { direct_links, time } ,status:"تمت العملية بنجاح",isSuccess:true  }
    );

    done(null, { direct_links, time });

    }catch (e) {
      await useUpdateStatus(`حدثت مشكله، مع الاسف`,docId,true)
      done(e)
    }
  });

  return res.status(200).json({ id: operation_id });

})

exports.OldInfoFetcher =catchAsync(async (req, res) => {
    const { link } = req.body;

    const page = await axios.get(encodeURI(link));

    const $ = cheerio.load(page.data);

    const title = $(".sub_title").find("h1").text().trim();
    const poster = $(".main_img")[0].attribs.src;
    const episodes = $(".akoam-buttons-group").length;
    const story = "القصه غير متوفره في الوقت الحالي";


    const newAkoam = await Scrapy.create({
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
    });

    return res
        .status(200)
        .json({ link, title, poster, episodes, story, id: newAkoam._id });
  })

exports.StartOldScrapper = catchAsync(async (req, res) => {
    const { id } = req.body;
    const isExisted = await Scrapy.findById(id);
    if (!isExisted || isExisted.operation) return res.status(httpStatus.FOUND).json(isExisted);
    const operation_id = "N" + randomBytes(7).toString("hex");



    const q = new Queue("akoam:old", Redis);
    q.add({ db: id,db_data:isExisted }, { jobId: operation_id });
    q.process(async (job, done) => {
      const docId = job.data.db_data._id


      try {
        const start = Date.now();
        const page = await axios.get(job.data.db_data.link);
        const $ = cheerio.load(page.data);
        let episodes_links = [];
        let direct_links = [];
        $(".akoam-buttons-group")
            .find("a")
            .each((e, i) => {
              episodes_links.push(i.attribs.href)});

        let unique_episodes_links = [...new Set(episodes_links)];

        for (let index = 0; index < unique_episodes_links.length; index++) {
          const progress = (((index + 1) / unique_episodes_links.length) * 100).toFixed(1)

          const link = unique_episodes_links[index]
          const hash = link.split("/").pop()
          const read_hashed_link = await axios.post(`https://mawsueaa.com/link/read?hash=${hash}`)

          if (read_hashed_link.data.success){
            const preDirectLink = read_hashed_link.data.result.route
            const { data } = await axios.post(preDirectLink, null, {
              headers: { "x-requested-with": "XMLHttpRequest", referer: preDirectLink },
            });
            direct_links.push(data.direct_link);
            await useUpdateStatus(`تم اتجاز: %${progress}`,docId)

          }
        }

        const end = Date.now();
        const time = (end - start) / 1000;

        await Scrapy.findOneAndUpdate(
            { _id: job.data.db },
            { operation: job.id, result: { direct_links, time },status:"انتهي بنجاح" ,isSuccess:true}
        );

        episodes_links =[]
        done(null, { direct_links, time });
      } catch (error) {
        await useUpdateStatus(`حدثت مشكله، مع الاسف`,docId,true)

        done(error);
      }
    });

    return res.status(httpStatus.CREATED).json({ id: operation_id });
  })
const {randomBytes} = require("crypto");
const {
    AkwamNewInfoFetcher,
    AkwamNewGetEpisodesLinks,
    AkwamNewGetShortedLinks,
    AkwamNewGetPreDirectLinks,
    AkwamNewGetDirectLinks,
    AkwamOldGetInfo,
    AkwamOldGetEpisodesLink,
    AkwamOldGetDirectLinks,
} = require("../libs/akoam");
const Scrapy = require("../models/scrapy");
const Queue = require("bull");
const {RedisClient} = require("../libs/redis");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const {useUpdateStatus} = require("../libs/Scrapy");

const Redis = RedisClient();

exports.InfoFetcher = catchAsync(async (req, res) => {
    const {link} = req.body;
    const {domain, episodes, story, poster, title} = await AkwamNewInfoFetcher(link)
    const user = {
        ip: req.ip, info: req.ipInfo, source: req.source
    }

    const newAkoam = await Scrapy.create({
        link, title, poster, episodes, story, user, domain,service:"New Akwam",path:"akoam",logo:"https://sendigram.fra1.digitaloceanspaces.com/5d58ae51ecbcf1476a888bbb4e4e734e493733be474313bb228819fb652d486_1fw4ml4mqw7um.png"

    });

    return res
        .status(httpStatus.CREATED)
        .json(newAkoam);

})


exports.StartScrapper = catchAsync(async (req, res) => {
    const {id} = req.body;
    const isExisted = await Scrapy.findById(id).where({service:"New Akwam"});

    if (!isExisted) return res.sendStatus(httpStatus.NO_CONTENT)
    if (isExisted.operation) return res.status(httpStatus.FOUND).json(isExisted);


    const operation_id = "n" + randomBytes(7).toString("hex").toLowerCase();
    const q = new Queue("akoam:new", Redis);


    q.add({db: id, db_data: isExisted}, {jobId: operation_id});
    q.process(async (job, done) => {
        const docId = job.data.db_data._id
        const doc = job.data.db_data
        await Scrapy.findByIdAndUpdate(docId, {isProcessing: true, operation: job.id,})
        try {


            const start = Date.now();

            const episodes_links = await AkwamNewGetEpisodesLinks(doc.link, docId);
            if (episodes_links.length === 0) return useUpdateStatus("اممم مشكله في جلب لينكات الحلقات، ربما في مشكله في اكوام. حاول كمان شويه او كلمني عشان اعمل ابديت", docId, true)

            const shorted_links = await AkwamNewGetShortedLinks(episodes_links, docId);
            if (shorted_links.length === 0) return useUpdateStatus("اممم مشكله في جلب لينكات التحميل1، ربما في مشكله في اكوام. حاول كمان شويه او كلمني عشان اعمل ابديت", docId, true)

            const preDirect_links = await AkwamNewGetPreDirectLinks(shorted_links, docId);
            if (preDirect_links.length === 0) return useUpdateStatus("اممم مشكله في جلب لينكات التحميل2، ربما في مشكله في اكوام. حاول كمان شويه او كلمني عشان اعمل ابديت", docId, true)

            const direct_links = await AkwamNewGetDirectLinks(preDirect_links, docId);

            const end = Date.now();
            const time = (end - start) / 1000;
            const result = await Scrapy.findByIdAndUpdate(docId, {
                result: {direct_links, time},
                status: "تمت العملية بنجاح",
                isSuccess: true,
                isProcessing: false,
                isError: false
            }, {new: true});

            done(null, result);

        } catch (e) {
            await useUpdateStatus(`حدثت مشكله، مع الاسف`, docId, true)
            done(e)
        }
    });

    return res.status(httpStatus.CREATED).json({operation: operation_id});

})

exports.OldInfoFetcher = catchAsync(async (req, res) => {
    const {link} = req.body;

    const {domain, episodes, story, poster, title} = await AkwamOldGetInfo(link)

    const user = {
        ip: req.ip, info: req.ipInfo, source: req.source
    }
    const newAkoam = await Scrapy.create({
        link, title, poster, episodes, story, user,service:"Old Akwam",domain,path:"akoam/old",logo:"https://sendigram.fra1.digitaloceanspaces.com/5d58ae51ecbcf1476a888bbb4e4e734e493733be474313bb228819fb652d486_1fw4ml4mqw7um.png"

    });

    return res
        .status(httpStatus.CREATED)
        .json(newAkoam);
})

exports.StartOldScrapper = catchAsync(async (req, res) => {
    const {id} = req.body;
    const isExisted = await Scrapy.findById(id).where({service:"Old Akwam"});
    if (!isExisted) return res.sendStatus(httpStatus.NO_CONTENT)
    if (isExisted.operation) return res.status(httpStatus.FOUND).json(isExisted);
    const operation_id = "n" + randomBytes(7).toString("hex").toLowerCase();


    const q = new Queue("akoam:old", Redis);
    q.add({db: id, db_data: isExisted}, {jobId: operation_id});
    q.process(async (job, done) => {
        const docId = job.data.db_data._id

        const doc = await Scrapy.findByIdAndUpdate(docId, {
            isProcessing: true,
            operation: job.id,
            status: "تم البدء بنجاح"
        }, {new: true})
        try {
            const start = Date.now();

            const Episodes = await AkwamOldGetEpisodesLink(doc.link)

            if (Episodes.length === 0) return useUpdateStatus("اممم، مشكلة في كود1. للاسف، فشلت العملية", true, docId)
            const DirectLinks = await AkwamOldGetDirectLinks(Episodes, docId)
            const end = Date.now();
            const time = (end - start) / 1000;

            await Scrapy.findOneAndUpdate({_id: job.data.db}, {
                operation: job.id,
                result: {direct_links: DirectLinks, time},
                status: "انتهي بنجاح",
                isSuccess: true,
                isError: false,
                isProcessing: false
            });

            done(null, {DirectLinks, time});
        } catch (error) {
            await useUpdateStatus(`حدثت مشكله، مع الاسف`, docId, true)

            done(error);
        }
    });

    return res.status(httpStatus.CREATED).json({operation: operation_id});
})
const Queue = require("bull");
const {randomBytes} = require("crypto");
const {RedisClient} = require("../libs/redis");
const Redis = RedisClient();
const Scrapy = require("../models/scrapy");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const Arabseeder = require("../libs/Arabseed");
const {useUpdateStatus} = require("../libs/Scrapy");


exports.InfoFetcher = catchAsync(async (req, res) => {

    const {link} = req.body;

    let domain = (new URL(link)).hostname;

    const data = await Arabseeder.SendRequestByProxy(link)

    const {story, info, episodes, title, service, poster} = Arabseeder.GetArabseedEpisodesLinks(data)
    const user = {
        ip: req.ip, info: req.ipInfo, source: req.source
    }
    const newArabseed = await Scrapy.create({
        link, story, info, episodes: episodes.length, title, service, poster, user, domain,path:"arabseed",logo:"https://arabseed.xyz/lgo222.png"
    });

    return res
        .status(httpStatus.CREATED).json(newArabseed);

})
exports.StartScrapper = catchAsync(async (req, res) => {

    const {id, quality} = req.body;
    const isExisted = await Scrapy.findById(id).where({service:"arabseed"})
    if (!isExisted) return res.sendStatus(httpStatus.NO_CONTENT);
    if (isExisted.operation) return res.status(httpStatus.FOUND).json(isExisted);

    const operation_id = "n" + randomBytes(7).toString("hex").toLowerCase();
    const q = new Queue("arabseed:new", Redis);
    q.add({db: id, quality}, {
        jobId: operation_id,
        removeOnComplete: true,

    },{});

    q.process(async (job, done) => {
        const start = Date.now();

        const {quality, db} = job.data;
        console.log(job.data)
        const q = quality - 1
        const doc = await Scrapy.findByIdAndUpdate(db, {operation: job.id,quality: q,isProcessing:true}, {new: true});
        try {
            await useUpdateStatus("تم بدأ العملية ...", doc._id,)
            const PrimeDownloadLinks = await Arabseeder.GetArabseedDownloadLinks(doc.info.episodes_links, q, doc.link, doc._id)

            if (PrimeDownloadLinks.length === 0 || PrimeDownloadLinks.includes(undefined)) {
                return useUpdateStatus("مع الاسف، حدثت مشكلة في كود1، ابعتلي سكرين شوت علي حسابي عشان ابحث في المشكلة", doc._id, true)
            }
            const ServerLinks = await Arabseeder.SkipCountdown(PrimeDownloadLinks,doc._id)
            if (ServerLinks.length === 0 || ServerLinks.includes(undefined)) {
                return useUpdateStatus("مع الاسف، حدثت مشكلة في كود2، ابعتلي سكرين شوت علي حسابي عشان ابحث في المشكلة", doc._id, true)

            }
            const FinalLinks = await Arabseeder.GetServerDownloadLinks(ServerLinks, doc._id)

            if (FinalLinks.length === 0) {
                return useUpdateStatus("مع الاسف، حدثت مشكلة في كود3، ابعتلي سكرين شوت علي حسابي عشان ابحث في المشكلة", doc._id, true)

            }
            const end = Date.now();
            const time = (end - start) / 1000;
            await Scrapy.findByIdAndUpdate(db, {
                 result: {
                    direct_links: FinalLinks, time,
                }, status: "تمت العملية بنجاح", isSuccess: true,
                isProcessing:false,
                isError:false,
            });

            done(null, {FinalLinks, time});
        } catch (e) {

            await useUpdateStatus("مع الاسف، حدثت مشكلة عموما، ابعتلي سكرين شوت علي حسابي عشان ابحث في المشكلة", doc._id, true)

            done(e)
        }

    });

    return res.status(httpStatus.CREATED).json({operation:operation_id });

})
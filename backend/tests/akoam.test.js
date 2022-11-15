const {AkwamNewInfoFetcher, AkwamNewGetEpisodesLinks, AkwamNewGetShortedLinks, AkwamNewGetPreDirectLinks,
	AkwamNewGetDirectLinks, AkwamOldGetEpisodesLink, AkwamOldGetInfo, AkwamOldGetDirectLinks, AkwamOldGetPreDirectLinks
} = require("../libs/akoam");
const { connectDB, dropDB, dropCollections } = require("./db.setup");
const Scrapy = require("../models/scrapy");

beforeAll(async () => {
	await connectDB();
});

afterAll(async () => {
	await dropDB();
});

afterEach(async () => {
	await dropCollections();
});
describe("New Akoam Test", () => {
	const TEST_URL = "https://akwam.us/series/3600/the-good-doctor-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-%D8%A7%D9%84%D8%B3%D8%A7%D8%AF%D8%B3"
	let episodes_links = []
	let shorted_links = []
	let pre_direct_links = []
	test('Fetch Info', async () => {
		const result = await AkwamNewInfoFetcher(TEST_URL)
		expect(result).not.toBe({})
		const newAkoam = await Scrapy.create({
			result
		});
		expect(newAkoam).not.toBe(null)
	});
	test('Fetch Episodes', async () => {
		const result = await AkwamNewGetEpisodesLinks(TEST_URL)
		expect(result.length).toBeGreaterThan(0)
		episodes_links = result
	})
	test("Fetch Shorted Links", async () => {
		const result =await AkwamNewGetShortedLinks(episodes_links)
		expect(result.length).toBeGreaterThan(0)
		shorted_links = result

	})
	test("Fetch All", async () => {
		const reuslt = await AkwamNewGetPreDirectLinks(shorted_links)
		expect(reuslt.length).toBeGreaterThan(0)
		pre_direct_links = reuslt
	})
	test("Direct Links", async () => {
		const result = await AkwamNewGetDirectLinks(pre_direct_links)
		expect(result.length).toBeGreaterThan(0)
	})
})


describe("Old Akoam Test",  () => {
	const TEST_URL = "https://old.akwam.to/172215/%D9%85%D8%B3%D9%84%D8%B3%D9%84-The-Rookie-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%8A-%D9%85%D8%AA%D8%B1%D8%AC%D9%85"
	let episodes_links = []
	let pre_links = []
	test("Fetch Info", async () => {
		const result = await AkwamOldGetInfo(TEST_URL)

		expect(result).not.toBe({})
	})

	test("Fetch Episodes", async () => {
		const result = await AkwamOldGetEpisodesLink(TEST_URL)
		expect(result.length).toBeGreaterThan(0)
		expect(result[0]).not.toBe(null)
		episodes_links = result
	})

	test("Fetch Pre Direct", async () => {
		const result = await AkwamOldGetPreDirectLinks(episodes_links)
		expect(result.length).toBeGreaterThan(0)
		expect(result).not.toContain(undefined)

		pre_links = result
	})


	test("Fetch Direct Links", async () => {
		const result = await AkwamOldGetDirectLinks(pre_links)
		expect(result.length).toBeGreaterThan(0)
		expect(result).not.toContain(undefined)

	})

})
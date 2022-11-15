const { connectDB, dropDB, dropCollections } = require("./db.setup");
const {GetArabseedDownloadLinks} = require("../libs/Arabseed");
const Arabseeder = require("../libs/Arabseed");

beforeAll(async () => {
	await connectDB();
});

afterAll(async () => {
	await dropDB();
});

afterEach(async () => {
	await dropCollections();
});

describe("Arabseed Test", () => {
	const TEST_URL = "https://arabseed.sbs/selary/%d9%85%d8%b3%d9%84%d8%b3%d9%84-%d8%a7%d9%84%d8%b6%d8%a7%d8%ad%d9%83-%d8%a7%d9%84%d8%a8%d8%a7%d9%83%d9%8a/"
	let episodes_links = []
	let prime_links = []
	test("Fetch Info", async () => {
		const data = await Arabseeder.SendRequestByProxy(TEST_URL)

		const {story, info, episodes, title, service, poster} = Arabseeder.GetArabseedEpisodesLinks(data)
		expect(story).not.toBe(null)
		expect(info).not.toBe(null)
		expect(episodes.length).toBeGreaterThan(0)
		expect(episodes).not.toContain(undefined)

		expect(title).not.toBe(null)
		expect(service).not.toBe(null)
		expect(poster).not.toBe(null)

		episodes_links = info.episodes_links
	})
	test("Fetch Episodes -> Prime ", async () => {
		const result = await Arabseeder.GetArabseedDownloadLinks(episodes_links)

		expect(result.length).toBeGreaterThan(0)
		expect(result).not.toContain(undefined)
		expect(result).not.toContain(null)
		expect(result).not.toContain("")
		expect(result[0]).toContain("https://")

		prime_links = result
	})

	test("Skip Countdown", async () => {
		const result = await Arabseeder.SkipCountdown(prime_links)
		console.log(result)
		expect(result.length).toBeGreaterThan(0)
		expect(result).not.toContain(undefined)
		expect(result).not.toContain(null)
		expect(result).not.toContain("")
		expect(result[0]).toContain("https://")
	})
})
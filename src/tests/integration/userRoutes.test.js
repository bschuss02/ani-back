const request = require("supertest")
const app = require("../../..")
const { User } = require("../../models/UserModel")
const { testUserInfo0 } = require("../constants")

describe("api/user", () => {
	// afterEach(async () => {
	// 	await User.deleteMany({ username: testUserInfo0.username })
	// })

	const exec = () => {
		return request(app)
			.get("/")
			.send()
	}

	it("should sign up a new user", async () => {
		const res = await exec()
		await expect(res.status).toBe(200)
	})
})

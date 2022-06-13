const request = require("supertest")

const { User } = require("../../models/UserModel")
const { testUserInfo0 } = require("../constants")

const app = require("../../..")

describe("auth middleware", () => {
	let token = ""

	// beforeEach(async () => {})
	// afterEach(() => {
	// 	// server.close()
	// })

	beforeEach(async () => {
		const user = new User(testUserInfo0)
		await user.save()
		token = user.generateAuthToken()
	})

	afterEach(async () => {
		await User.deleteMany({ username: testUserInfo0.username })
	})

	const exec = () => {
		return request(app)
			.get("/api/user/me")
			.set("x-auth-token", token)
			.send()
	}

	it("should return 200 if valid token is provided", async () => {
		const res = await exec()
		await expect(res.status).toBe(200)
	})

	it("should return 401 if no token is provided", async () => {
		token = ""
		const res = await exec()
		await expect(res.status).toBe(401)
	})

	it("should return 400 if invalid token is provided", async () => {
		token = "asdf"
		const res = await exec()
		await expect(res.status).toBe(400)
	})
})

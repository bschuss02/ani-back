const mongoose = require("mongoose")
const config = require("config")
const { User } = require("../../../models/UserModel")
const jwt = require("jsonwebtoken")

describe("userSchema.generateAuthToken", () => {
	it("should return a valid JWT", async () => {
		const payload = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			username: "uname_0000",
			name: {
				firstname: "fname_0000",
				lastname: "lname_0000",
			},
		}
		const user = new User(payload)
		const token = user.generateAuthToken()
		const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
		expect(decoded).toMatchObject(payload)
	})
})

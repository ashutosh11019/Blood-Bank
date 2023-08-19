const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: ['donor', 'organization', 'hospital', 'admin']
    },
    name: {
        type: String,
        requied: function () {
            if (this.userType === "admin" || this.userType === "donor") {
                return true;
            }
            return false;
        }
    },
    hospitalName: {
        type: String,
        requied: function () {
            if (this.userType === "hospital") {
                return true;
            }
            return false;
        }
    },
    organizationName: {
        type: String,
        requied: function () {
            if (this.userType === "organization") {
                return true;
            }
            return false;
        }
    },
    owner: {
        type: String,
        requied: function () {
            if (this.userType === "organization" || this.userType === "hospital") {
                return true;
            }
            return false;
        }
    },
    website: {
        type: String,
        requied: function () {
            if (this.userType == "organization" || this.userType == "hospital") {
                return true;
            }
            return false;
        }
    },
    address: {
        type: String,
        requied: function () {
            if (this.userType == "organization" || this.userType == "hospital") {
                return true;
            }
            return false;
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
}, { timestamps: true })

const user = mongoose.model("user", userSchema)

module.exports = user
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')
const Inventory = require("../models/inventoryModel")
const mongoose = require("mongoose")

router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email })
        if (userExists) {
            return res.send({
                success: false,
                message: "User already exist"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword
        const user = new User(req.body)
        await user.save()
        return res.send({
            success: true,
            message: "User Registered Successfully!!!"
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.post("/login", async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email })
        if (!userExists) {
            return res.send({
                success: false,
                message: "User not Found"
            })
        }
        if (userExists.userType !== req.body.userType) {
            return res.send({
                success: false,
                message: `User is not registered as ${req.body.userType}`
            })
        }
        const validPassword = await bcrypt.compare(req.body.password, userExists.password)
        if (!validPassword) {
            return res.send({
                success: false,
                message: "Invalid Password"
            })
        }
        const token = jwt.sign({ userId: userExists._id }, process.env.jwt_secret, { expiresIn: '1d' })
        return res.send({
            success: true,
            message: "Login Successfully!!!",
            data: token
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.get("/get-current-user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId })
        return res.send({
            success: true,
            message: "User Fetch Successfully",
            data: user
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.get("/get-all-donars", authMiddleware, async (req, res) => {
    try {
        const organization = new mongoose.Types.ObjectId(req.body.userId)
        // const uniqueDonarIds = await Inventory.aggregate([
        //     {
        //         $match: {
        //             organization,
        //             inventoryType: "in"
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$donor"
        //         }
        //     }
        // ])
        const uniqueDonarIds = await Inventory.distinct("donor", { organization })
        const donars = await User.find({
            _id: {
                $in: uniqueDonarIds
            }
        })
        // console.log(uniqueDonarIds)
        return res.send({
            success: true,
            message: "Donars Fetch Successfully",
            data: donars
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.get("/get-all-hospitals", authMiddleware, async (req, res) => {
    try {
        const organization = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueHospitalIds = await Inventory.distinct("hospital", { organization })
        const hospitals = await User.find({
            _id: {
                $in: uniqueHospitalIds
            }
        }).populate("owner")
        // console.log(uniqueHospitalIds)
        return res.send({
            success: true,
            message: "Hospitals Fetch Successfully",
            data: hospitals
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.get("/get-all-organization-of-a-donor", authMiddleware, async (req, res) => {
    try {
        const donor = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueOrganizationIds = await Inventory.distinct("organization", { donor })
        const organizations = await User.find({
            _id: {
                $in: uniqueOrganizationIds
            }
        }).populate("owner")
        // console.log(uniqueHospitalIds)
        return res.send({
            success: true,
            message: "Organizations Fetch Successfully",
            data: organizations
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.get("/get-all-organization-of-a-hospital", authMiddleware, async (req, res) => {
    try {
        const hospital = new mongoose.Types.ObjectId(req.body.userId)
        const uniqueOrganizationIds = await Inventory.distinct("organization", { hospital })
        const organizations = await User.find({
            _id: {
                $in: uniqueOrganizationIds
            }
        }).populate("owner")
        // console.log(uniqueHospitalIds)
        return res.send({
            success: true,
            message: "Organizations Fetch Successfully",
            data: organizations
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


module.exports = router

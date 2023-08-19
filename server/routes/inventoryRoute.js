const router = require('express').Router()
const Inventory = require('../models/inventoryModel')
const authMiddleware = require('../middlewares/authMiddleware')
const User = require('../models/userModel')
const mongoose = require("mongoose")

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new Error("Invalid Error!!!")
        }
        if (req.body.inventoryType === "in" && user.userType !== "donor") {
            throw new Error("This email is not registered as a donor")
        }
        if (req.body.inventoryType === "out" && user.userType !== "hospital") {
            throw new Error("This email is not registered as a hospital")
        }
        if (req.body.inventoryType === "out") {
            const requestedGroup = req.body.bloodGroup
            const requestedQuantity = req.body.quantity
            const organization = new mongoose.Types.ObjectId(req.body.userId)

            // console.log(organization)

            const totalInOfRequestedGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "in",
                        bloodGroup: requestedGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: {
                            $sum: "$quantity",
                        }
                    }
                }
            ])

            const totalIn = totalInOfRequestedGroup[0].total || 0

            const totalOutOfRequestedGroup = await Inventory.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "out",
                        bloodGroup: requestedGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: {
                            $sum: "$quantity",
                        }
                    }
                }
            ])

            const totalOut = totalOutOfRequestedGroup[0]?.total || 0

            const availableQuantity = totalIn - totalOut
            if (availableQuantity < requestedQuantity) {
                throw new Error(`only ${availableQuantity} units of ${requestedGroup.toUpperCase()} is available`)
            }
            // console.log(totalInOfRequestedGroup)
            req.body.hospital = user._id
        } else {
            req.body.donor = user._id
        }
        const inventory = new Inventory(req.body)
        await inventory.save()
        return res.send({
            success: true,
            message: "Inventory Added Successfully!!!"
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.get('/get', authMiddleware, async (req, res) => {
    try {
        const inventory = await Inventory.find({ organization: req.body.userId }).sort({ createdAt: -1 }).populate("donor").populate("hospital")
        return res.send({
            success: true,
            data: inventory
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


router.post('/filter', authMiddleware, async (req, res) => {
    try {
        // console.log(req.body.filters)
        const inventory = await Inventory.find(req.body.filters)
            .limit(req.body.limit || 10)
            .sort({ createdAt: -1 })
            .populate("donor")
            .populate("hospital")
            .populate("organization")

        return res.send({
            success: true,
            data: inventory
        })
    } catch (error) {
        return res.send({
            success: false,
            message: error.message
        })
    }
})


module.exports = router
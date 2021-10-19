const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")



//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json("Account has been updated")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("you can update only your account")
    }
})
//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})
//lh:8800/users/user?userId= 23344566
//lh:8800/users/username=datong u can use both usernameand userId
//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId
    const username = req.query.username
    try {
        const user = userId ? await User.findById(userId) : await User.findOne({ username: username })
        // const user = await User.findById(req.params.id)
        const { password, updatedAt, ...others } = user._doc
        res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
})

//get friend
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = User.findById(req.params.userId)
        const friends = await new Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = []
    } catch (err) {
        console.log(err).json(err)
    }

})
//follow a user
router.put("/:id/follow", async (req, res) => {
    console.log("follow a user")
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await User.updateOne({ id: req.params.id }, { $push: { followers: req.body.userId } })
                await User.updateOne({ id: req.body.userId }, { $push: { followings: req.params.id } })
                res.status(200).json("user has been followed")
            } else {
                res.status(200).json("you already follow this user")
            }

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant follow yourself")
    }
})
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    console.log("unfollow a user")
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json("you dont follow this user")
            }

        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You cant unfollow yourself")
    }
})
//


module.exports = router
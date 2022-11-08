const express = require('express');
const router = new express.Router()
const multer = require('multer');
const checkAuth = require( '../middleware/check_auth' );
const Profile = require('../models/profile')

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif"
}

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        console.log(req, file)
        const isValid = MIME_TYPE_MAP[file.mimetype];

        let error = new Error("Invalid mime type");

        if(isValid){
            error= null;
        }
        cb(error, "images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname
                      .toLowerCase()
                      .split("")
                      .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+ "-" + Date.now() + "." + ext);              
    }
})



router.post("/create", checkAuth,
      multer({storage: storage}).single("image"),
      (req, res, next) => {
        const url = req.protocol + "://" + req.get("host");
        console.log('url', url)
        const profile = new Profile({
            username: req.body.username,
            bio: req.body.bio,
            imagePath: url + "/images/",
            creator: req.userData.userId,
        })
        Profile.findOne({creator: req.userData.userId}).then((user1) => {
            if(user1){
                return res.status(401).json({
                    message: "Profile Already Exists",
                })
            }
            return profile.save()
        }).then(prof => {
            if(!prof){
                return res.status(500).json({
                    message: "Error creating profile"
                })
            }
            res.status(201).json({
                message: "Profile created!",
                profile: prof,
            })
        }).catch(e => {
            console.log(e)
        })
      }
 )

 router.put("/edit/:id", checkAuth,
 multer({storage: storage}).single("image"),
 (req, res) => {
             let imagePath = req.body.imagePath;
             const url = req.protocol + "://" + req.get("host");
             if(req.file){
                imagePath = url + "/images/" + req.file.filename
             }

             const profile = new Profile({
                _id: req.body.id,
                username: req.body.username,
                bio: req.body.bio,
                imagePath: imagePath,
                creator: req.userData.userId,
             })
             Profile.updateOne(
                {_id: req.params.id,
                 creator: req.userData.userId,
                }
             ).then(result => {
                if(result){
                    res.status(200).json({message: "Update successfull"})
                }else{
                    res.status(500).json({message: "Error updating profile"})
                }
             })
             .catch(e => {
                console.log(e)
             })
 })

router.get("/profiles", checkAuth, (req, res, next) => {
    Profile.find().then(prof => {
        if(prof){
            res.status(200).json({
                message: "Profile fetched successfully",
                profile: prof,
            })
        }else{
            res.status(404).json({message: "Profile not found !"})
        }
    })
    .catch(e => {
        console.log(e)
    })
}) 


module.exports = router;
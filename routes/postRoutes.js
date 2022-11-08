const express = require('express');
const Post = require('../models/post');
const router = new express.Router()
const multer = require('multer');
const checkAuth = require('../middleware/check_auth');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif"
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
         const isValid = MIME_TYPE_MAP[file.mimetype]
         const error = new Error("inValid file type")
         if(isValid){
           error = null
         }
         cb(error, 'images')
    },
    filename: function(req, file, cb){
        const name = file.originalname
                       .toLowerCase()
                       .split("")
                       .join("_")
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name+ "-" + Date.now() + "." + ext)               
    }
})


router.post("", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host")
    const post  = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url+ "/images/" + req.file.filename,
        creator: req.body.creator,
        postDate: req.body.postDate,
    })
    post.save()
    .then((post) => {
           if(post){
            res.status(200).json({
                message: "Post added successfully",
                post: {
                       ...post,
                       id: post.id
                }
            })
                          
           }
           if(!post){
              res.status(404)
              .json({message: "Error adding post!"})
           }
    })
    .catch((e) => {
        console.log(e)
        res.status(500).json({
            message: `Error adding Post! ${e}`
        })
    })
})

router.put(
    "/:id",
    checkAuth,
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }

        // console.log("90",req.body)
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        });
        // console.log("98---------------------",post);
        console.log('rq', req.params.id)
        Post.updateOne(
            { _id: req.params.id, creator: req.userData.userId },
            post
          ).then(result => {
            if(result){
                res.status(200).json({ message: "Update successful!" });
            }
            else {
                res.status(500).json({ message: "Error Upating Post" });
            }
        });
    }
);

router.get("/myposts", 
      checkAuth,
      (req, res, next) => {
        Post.find({creator: req.userData.userId}).then(post => {
            if(post){
                res.status(200).json({
                    message: "Posts fetched Successfully",
                    posts: post,
                });
            }else{
                res.status(400).json({message: "Post not found!"})
            }
        })
        .catch(e => {
            console.log(e)
        })
      }
)    

router.get("", checkAuth, (req, res, next) => {
    Post.find().then(documents => {
        if(documents){
            res.status(200).json({
                message: "Posts fetched Successfully",
                posts : documents,
            })
        }else{
            res.status(400).json({message: "Post not found!"})
        }
    })
})

router.get("/:id",checkAuth, (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({message: "Post not found!"});
        }
    })
})

router.delete("/:id", checkAuth, (req, res, next) => {
    console.log('rp', req.params.id)
    Post.deleteOne({_id : req.params.id,  creator: req.userData.userId}).then(
        result => {
            if(!result.n > 0){
                res.status(200).json({message: "Deleted successfully"});
            }else{
                res.status(401).json({message: "Not authorized"});
            }
        }
    );
});


module.exports = router;
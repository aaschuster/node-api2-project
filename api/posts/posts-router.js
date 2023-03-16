// implement your posts router here

const express = require("express");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json(
                { message: "The posts information could not be retrieved" }
            )
        })
})

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if(post) 
                res.status(200).json(post);
            else 
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                });
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.post("/", (req, res) => {
    if(req.body.title && req.body.contents) {
        Posts.insert(req.body)
            .then( insertRes => {
                res.status(201).json({
                    ...req.body, id: insertRes.id
                });
            })
            .catch( err => {
                res.status(500).json({ 
                    message: "There was an error while saving the post to the database" 
                })
            });
    } else {
        res.status(400).json({ message: "Please provide title and contents for the post" });
    }
})

router.put("/:id", async (req, res) => {
    const {id} = req.params;

    try {
        if(req.body.title && req.body.contents) {
            const postIDValid = await Posts.update(id, req.body);
            if (postIDValid) {
                const updatedPost = await Posts.findById(id);
                res.status(200).json(updatedPost);
            } else {
                res.status(404).json(
                    { message: "The post with the specified ID does not exist" }
                )
            }
        } else {
            res.status(400).json({ message: "Please provide title and contents for the post" });
        }
    } catch {
        res.status(500).json({ 
            message: "The post information could not be modified" 
        });
    }
})

router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const post = await Posts.findById(id);

    try {
        const IDvalid = await Posts.remove(id);
        if(IDvalid) {
            res.status(200).json(post);
        } else {
            res.status(404).json (
                { message: "The post with the specified ID does not exist" }
            )
        }
    } catch {
        res.status(500).json( {
            message: "The post could not be removed"
        } )
    }
})

router.get("/:id/comments", async (req, res) => {
    const {id} = req.params;
    const post = await Posts.findById(id);

    Posts.findPostComments(id)
        .then( comments => {
            if(post) res.status(200).json(comments);
            else {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist" 
                })
            }
        })
        .catch( err => {
            res.status(500).json({
                message: "The comments information could not be retrieved"
            })
        })
})

module.exports = router;
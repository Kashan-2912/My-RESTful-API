//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);




//================================ REQUEST TARGETING ALL ARTICLES ================================//




app.route("/articles") //chained route handler in express ...
    .get(function(req, res){
        Article.find({})
        .then(foundArticles => {
            res.send(foundArticles);
        })
        .catch(err => {
            res.send(err);
        });
    })

    .post(function(req, res){

        const newArticle = new Article({
             title: req.body.title,
             content: req.body.content
        });
     
        newArticle.save()
        .then(res.send("Successfully added new article."))
        .catch(err => {
             res.send(err);
        })
     })

     .delete(function(req, res){
        Article.deleteMany({})
        .then(res.send("Deleted all articles."))
        .catch(err => {
            res.send(err);
        });
    });




//============================== REQUEST TARGETING SPECIFIC ARTICLES ==============================//



app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({
        title: req.params.articleTitle
    })
    .then(foundArticle => {
        res.send(foundArticle);
    })
    .catch(err => {
        res.send("Error finding article ", err);
    });
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        
    )
    .then(foundArticle => {
        res.send("Successfully updated Article.");
    })
    .catch(err => {
        res.send("No articles matching that title was found.")
    });

})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    )
    .then(res.send("Successfully updated article."))
    .catch(err => {
        res.send(err);
    });
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle}
    )
    .then(result => {
        if(result.deletedCount === 0){
            res.send("No document found that matches title to be deleted.");
        } else{
            res.send("Deleted Article successfully.");
        }
    })
    .catch(err => {
        res.send(err);
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
var expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();

// App Config
mongoose.connect("mongodb://localhost/restful_blog_app" || "mongodb://brendon:passwrd1@ds237072.mlab.com:37072/restful-routing");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// Mongoose/model Config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

// Index Route
app.get("/blogs",  function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("Error!");
    } else {
        res.render("index", {blogs: blogs});
    }
  });
});
// New Route
app.get("/blogs/new", function(req, res) {
  res.render("new");
});
// Create Route
app.post("/blogs", function(req, res) {
  //create blog
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log(req.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render("new");
    } else {
        //redirect to index
        res.redirect("/blogs");
    }
  });
  
});
// Show Route
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
        res.render("show", {blog: foundBlog});
    }
  });
});

// Edit Route
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

// Update Route
app.put("/blogs/:id", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
        res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Delete Route
app.delete("/blogs/:id", function(req, res) {
  // Destroy blog
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
        res.redirect("/blogs");
    }
  });
  // Redirect somewhere
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server is running!");
});
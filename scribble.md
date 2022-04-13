# 18.1.4

This has all been an introduction to the ideas behing NoSQL vs SQL. We also set up the set up the MongoDB and it appears I will need to type `mongod` everytime to get it running.

| SQL    | NoSQL      |
| ------ | ---------- |
| Table  | Collection |
| Row    | Document   |
| Column | Field      |

# 18.1.5

In this we created the pizza model. The code for that looked a bit like this

const { Schema, model } = require("mongoose");

const PizzaSchema = new Schema({
pizzaName: {
type: String,
},
createdBy: {
type: String,
},
createdAt: {
type: Date,
default: Date.now,
},
size: {
type: String,
default: "Large",
},
toppings: [],
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;

You'll see that there are a ton of things similar to Sequelize which I beleive is the intent of Mongoose. We also went into server.js to require mongoose.

# 18.1.6

Here we set up the the CRUD methods all withing the pizzaController object.

const { Pizza } = require("../models");

const pizzaController = {
// get all pizzas
getAllPizza(req, res) {
Pizza.find({})
.then((dbPizzaData) => res.json(dbPizzaData))
.catch((err) => {
console.log(err);
res.status(400).json(err);
});
},

// get one pizza by id
getPizzaById({ params }, res) {
Pizza.findOne({ \_id: params.id })
.then((dbPizzaData) => {
// If no pizza is found, send 404
if (!dbPizzaData) {
res.status(404).json({ message: "No pizza found with this id!" });
return;
}
res.json(dbPizzaData);
})
.catch((err) => {
console.log(err);
res.status(400).json(err);
});
},

// createPizza
createPizza({ body }, res) {
Pizza.create(body)
.then((dbPizzaData) => res.json(dbPizzaData))
.catch((err) => res.status(400).json(err));
},

// update pizza by id
updatePizza({ params, body }, res) {
Pizza.findOneAndUpdate({ \_id: params.id }, body, { new: true })
.then((dbPizzaData) => {
if (!dbPizzaData) {
res.status(404).json({ message: "No pizza found with this id!" });
return;
}
res.json(dbPizzaData);
})
.catch((err) => res.status(400).json(err));
},

// delete pizza
deletePizza({ params }, res) {
Pizza.findOneAndDelete({ \_id: params.id })
.then((dbPizzaData) => {
if (!dbPizzaData) {
res.status(404).json({ message: "No pizza found with this id!" });
return;
}
res.json(dbPizzaData);
})
.catch((err) => res.status(400).json(err));
},
};

module.exports = pizzaController;

It is a bit unclear as to why we are putting things in an object this time but I think they will explain themselves once we get them hooked up. As of now this appears to be only 1/2 of what is needed to run the api CRUD functions.

# 18.1.7

Here we did something cool in the routes folder and basically requred all the methods we just created in pizza-controller.js.

const router = require("express").Router();
const {
getAllPizza,
getPizzaById,
createPizza,
updatePizza,
deletePizza,
} = require("../../controllers/pizza-controller");

// Set up GET all and POST at /api/pizzas
// /api/pizzas
router.route("/").get(getAllPizza).post(createPizza);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
// /api/pizzas/:id
router.route("/:id").get(getPizzaById).put(updatePizza).delete(deletePizza);

module.exports = router;

The top bit requires everything in that file and then the next two router.route sets up the path. We were able to ("/") routes on one line and all the ("/:id") routes on another seeing as how they are all looking for the same things but then doing something different with them. Then we went into the index.js for api and told it to looks at this new pizza-routes file like this

const router = require("express").Router();
const pizzaRoutes = require("./pizza-routes");

// add prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use("/pizzas", pizzaRoutes);

module.exports = router;

Lines 141 and 144 are the new lines used here. And fianlly went into the main index.js of the entire routes folder and told it to look at the newly created api folder.

const router = require("express").Router();
// Import all of the API routes from /api/index.js (no need for index.js though since it's implied)
const apiRoutes = require("./api");
const htmlRoutes = require("./html/html-routes");

// add prefix of `/api` to all of the api routes imported from the `api` directory
router.use("/api", apiRoutes);
router.use("/", htmlRoutes);

router.use((req, res) => {
res.status(404).send("<h1>😝 404 Error!</h1>");
});

module.exports = router;

Line 152 and 156 are the new things we added here.

# 18.1.8

We tested all the controllers/api routes in insomnia then we went to the front end add-pizza.js and added the fetch so when you hit submit it updates the DB.

const handlePizzaSubmit = (event) => {
event.preventDefault();

const pizzaName = $pizzaForm.querySelector("#pizza-name").value;
  const createdBy = $pizzaForm.querySelector("#created-by").value;
  const size = $pizzaForm.querySelector("#pizza-size").value;
  const toppings = [
    ...$pizzaForm.querySelectorAll("[name=topping]:checked"),
].map((topping) => {
return topping.value;
});

if (!pizzaName || !createdBy || !toppings.length) {
return;
}

const formData = { pizzaName, createdBy, size, toppings };

fetch("/api/pizzas", {
method: "POST",
headers: {
Accept: "application/json",
"Content-Type": "application/json",
},
body: JSON.stringify(formData),
})
.then((response) => response.json())
.then((postResponse) => {
alert("Pizza created successfully!");
console.log(postResponse);
})
.catch((err) => {
console.log(err);
});
};

# 18.2.3

Set up the Comment Model. Looks like this.

const { Schema, model } = require("mongoose");

const CommentSchema = new Schema({
writtenBy: {
type: String,
},
commentBody: {
type: String,
},
createdAt: {
type: Date,
default: Date.now,
},
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;

Now we are going to set up it's relationship to the Pizza Model.

# 18.2.4

We told the Pizza Model to look for the Comment Model and grab all comments and toss them into an array.

const PizzaSchema = new Schema(
{
pizzaName: {
type: String,
},
createdBy: {
type: String,
},
createdAt: {
type: Date,
default: Date.now,
},
size: {
type: String,
default: "Large",
},
toppings: [],
comments: [
{
type: Schema.Types.ObjectId,
ref: "Comment",
},
],
},
{
toJSON: {
virtuals: true,
},
id: false,
}
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
return this.comments.length;
});

This is line 253 - 258. Then we created something called a virtual and used it to to count how many comments are present and then allowed it to show up Model in the schema options which start at line 261 and end at line 265.

# 18.2.5

This one was some aggresive copy pasta that I am unable to test yet seeing as how we do not have the routes set up. So we created a file called comment-controller.js and required the Pizza and the Comment Model. Then we added the ability to add a comment.

addComment({ params, body }, res) {
console.log(body);
Comment.create(body)
.then(({ \_id }) => {
return Pizza.findOneAndUpdate(
{ \_id: params.pizzaId },
{ $push: { comments: \_id } },
{ new: true }
);
})
.then((dbPizzaData) => {
if (!dbPizzaData) {
res.status(404).json({ message: "No pizza found with this id!" });
return;
}
res.json(dbPizzaData);
})
.catch((err) => res.json(err));
},

I will need to test these out to understand it more later. Next we added the ability to remove a comment from a pizza.

removeComment({ params }, res) {
Comment.findOneAndDelete({ \_id: params.commentId })
.then((deletedComment) => {
if (!deletedComment) {
return res.status(404).json({ message: "No comment with this id!" });
}
return Pizza.findOneAndUpdate(
{ \_id: params.pizzaId },
{ $pull: { comments: params.commentId } },
{ new: true }
);
})
.then((dbPizzaData) => {
if (!dbPizzaData) {
res.status(404).json({ message: "No pizza found with this id!" });
return;
}
res.json(dbPizzaData);
})
.catch((err) => res.json(err));
},

Again testing will be needed for me to fully understand this code.

# 18.2.7

Set up the front end to show the pizzas with this.

const getPizzaList = () => {
fetch("/api/pizzas")
.then((response) => response.json())
.then((pizzaListArr) => {
pizzaListArr.forEach(printPizza);
})
.catch((err) => {
console.log(err);
});
};

We then called this at the bottom of pizza-list.js and call the already built print pizza for everything that is already there.

Finally we updated the pizza Model to look at the time and convert it into something that looks good. We set this up by using our date format middleware and then in the Pizza model using something called a getter.

createdAt: {
type: Date,
default: Date.now,
get: (createdAtVal) => dateFormat(createdAtVal),
},

We also had to allow it in the options by adding `getters: true`

# 18.3.3

We set up the front end to single-pizza.js. We first added the code to display the single get.

function getPizza() {
// get id of pizza
const searchParams = new URLSearchParams(document.location.search.substring(1));
const pizzaId = searchParams.get('id');

// get pizzaInfo
fetch(`/api/pizzas/${pizzaId}`)
.then(response => {
if (!response.ok) {
throw new Error({ message: 'Something went wrong!' });
}

      return response.json();
    })
    .then(printPizza)
    .catch(err => {
      console.log(err);
      alert('Cannot find a pizza with this id! Taking you back.');
      window.history.back();
    });

}

Then we added the ability to create a new comment on the front end.

function handleNewCommentSubmit(event) {
event.preventDefault();

const commentBody = $newCommentForm.querySelector('#comment').value;
const writtenBy = $newCommentForm.querySelector('#written-by').value;

if (!commentBody || !writtenBy) {
return false;
}

const formData = { commentBody, writtenBy };

fetch(`/api/comments/${pizzaId}`, {
method: 'POST',
headers: {
Accept: 'application/json',
'Content-Type': 'application/json'
},
body: JSON.stringify(formData)
})
.then(response => {
if (!response.ok) {
throw new Error('Something went wrong!');
}
response.json();
})
.then(commentResponse => {
console.log(commentResponse);
location.reload();
})
.catch(err => {
console.log(err);
});
}

This worked almost exactly like the handle pizza submit with the main difference of adding the ${pizzaId} to the fetch route so it know to get that which comes from the let up top.

# 18.3.4

Added a ReplySchema to the Comment.js. Here we did not create a new model because we will never query just for reply data. First we added the ReplySchema above the comments schema.

const ReplySchema = new Schema(
{
// set custom id to avoid confusion with parent comment \_id
replyId: {
type: Schema.Types.ObjectId,
default: () => new Types.ObjectId(),
},
replyBody: {
type: String,
},
writtenBy: {
type: String,
},
createdAt: {
type: Date,
default: Date.now,
get: (createdAtVal) => dateFormat(createdAtVal),
},
},
{
toJSON: {
getters: true,
},
}
);

We added the getter so it will use the date formatter. We also required the date formatter up top so we can use it in this file. Next we updated the comment schema to look for replies and brought in the date formatter and gave it permission to view use a vitual.

const CommentSchema = new Schema(
{
writtenBy: {
type: String,
},
commentBody: {
type: String,
},
createdAt: {
type: Date,
default: Date.now,
get: (createdAtVal) => dateFormat(createdAtVal),
},
// use ReplySchema to validate data for a reply
replies: [ReplySchema],
},
{
toJSON: {
virtuals: true,
getters: true,
},
id: false,
}
);

Lastly we added the Virtual that will count the legnth of the replies array to give us it's count.

CommentSchema.virtual("replyCount").get(function () {
return this.replies.length;
});

Then in a suprise pivot we jumped over to the Pizza.js model and upated it's virtual to get all complicated.

PizzaSchema.virtual("commentCount").get(function () {
return this.comments.reduce(
(total, comment) => total + comment.replies.length + 1,
0
);
});

This is the first time we have been introduced to the .reduce(). It basically walks through the array and adds to the total everytime it finds a comment.

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
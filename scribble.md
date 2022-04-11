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

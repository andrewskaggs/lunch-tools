var express = require('express')
  , router = express.Router()
  , __ = require('underscore')
  ;

var Lunch = function(date, menu) {
  this.date = date;
  this.menu = menu;
};

var lunches = [
  new Lunch("20141103", "Hearty Beef Stew; Dinner Rolls w/ compound butter; Broccoli w/ Garlic"),
  new Lunch("20141104", "BBQ Chicken Sliders w/ jack cheese & bacon; Mac & Cheese; Collards"),
  new Lunch("20141105", "Chicken, Gnocchi, & Spinach in a white wine cream sauce; Mushroom Rice; Grilled Zucchini & Squash"),
  new Lunch("20141106", "Cheeseburger Sliders w/ mushroom & swiss; Sautéed Corn & Peas; Baked Beans"),
  new Lunch("20141107", "Pancakes w/ fresh fruit, whipped cream, maple syrup; Bacon; Roasted Potatoes"),
  new Lunch("20141110", "Sausage, Kale, & White Bean Stew; Garlic Roasted Potatoes; Roasted Broccoli & Cauliflower"),
  new Lunch("20141111", "French Dip w/ jus & horseradish mayo; Braised Cabbage; Mashed Potatoes"),
  new Lunch("20141112", "Stuffed Peppers w/ beef, rice, cheese; Dueling Chips & Salsa; Blackened Corn w/ cheese & tomato"),
  new Lunch("20141113", "Pesto Chicken Sandwiches w/ provolone, onion, tomato; Lemon Garlic Rice; Green Beans w/ tomato"),
  new Lunch("20141114", "Gryos w/ tzatziki, lettuce, tomato; Creamed Spinach w/ Feta; Oregano Roasted Potatoes"),
];

router.get('/', function(req, res) {
  res.send(lunches);
});

router.get('/:date', function(req, res) {
  var lunch = __.findWhere(lunches, { date: req.params.date })
  res.send(lunch);
});

module.exports = router;

const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(request, response, next) {
  const { dishId } = request.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    response.locals.dish = foundDish;
    return next()
  }
  next({
    status: 404,
    message: `Dish id not found: ${dishId}`,
  });
}

function nameIsValid(request, response, next) {
  const { data: { name } = {} } = request.body;
  if (!name || name === "") {
    next({
    status: 400,
    message: `Dish must include a name`,
  });    
  } else {
    return next();
  }
}

function descriptionIsValid(request, response, next) {
  const { data: { description } = {} } = request.body;
  if (description) {
    return next();
  } else {
    next({
    status: 400,
    message: `Dish must include a description`,
  });
  }
}

function image_urlIsValid(request, response, next) {
  const { data: { image_url } = {} } = request.body;
  if (!image_url || image_url === "") {
    next({
    status: 400,
    message: `Dish must include an image_url`,
  });
  } else {
    return next();
  }
}

function priceIsValid(request, response, next) {
  const { data: { price } = {} } = request.body;
  if (!price || price < 0 || typeof price === "string") {
    next({
    status: 400,
    message: `Dish must include a price`,
  });
  } else {
    return next();
  }
}

function create(request, response, next) {
  const { data: { name, description, image_url, price } = {} } = request.body;
  const newDish = {
    id: nextId(), // Increment last id then assign as the current ID
    name,
    description,
    image_url,
    price
  };
  dishes.push(newDish);
  
  response.status(201).json({ data: newDish });
}


function update(request, response, next) {
  const dish = response.locals.dish;
  const { data: { description, id, image_url, name, price } = {} } = request.body;
  if(id) {
    if(id !== dish.id) {
      next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dish.id}`,
  });
    }
  }
  
  dish.description = description;
  dish.id = id;
  dish.image_url = image_url;
  dish.name = name;
  dish.price = price;
  
  response.json({ data: dish });
}

function read(request, response, next) {
  response.json({ data: response.locals.dish });
}

function list(request, response) {
  response.json({ data: dishes });
}

module.exports = {
  create: [nameIsValid, descriptionIsValid, image_urlIsValid, priceIsValid, create],
  list,
  read: [dishExists, read],
  update: [dishExists, nameIsValid, descriptionIsValid, image_urlIsValid, priceIsValid, update],
};

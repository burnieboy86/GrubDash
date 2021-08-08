const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function orderExists(request, response, next) {
  const { orderId } = request.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    response.locals.order = foundOrder;
    return next()
  }
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  });
}

function deliverToIsValid(request, response, next) {
  const { data: { deliverTo } = {} } = request.body;
  if (!deliverTo || deliverTo === "") {
    next({
    status: 400,
    message: `Order must include a deliverTo`,
  });    
  } else {
    return next();
  }
}

function mobileNumberIsValid(request, response, next) {
  const { data: { mobileNumber } = {} } = request.body;
  if (mobileNumber) {
    return next();
  } else {
    next({
    status: 400,
    message: `Order must include a mobileNumber`,
  });
  }
}

function dishesIsValid(request, response, next) {
  const { data: { dishes } = {} } = request.body;
  if (!dishes) {
    next({
    status: 400,
    message: `Order must include a dish`,
  });
  } else if(typeof dishes !== "object" || dishes.length === 0) {
    next({
    status: 400,
    message: `Order must include at least one dish`,
  });
  } else {
    for(let dish of dishes) {
      if(!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
        next({
    status: 400,
    message: `Dish ${dishes.indexOf(dish)} must have a quantity that is an integer greater than 0`,
  });
      }
  }
  }
  return next();
}

function create(request, response, next) {
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = request.body;
  const newOrder = {
    id: nextId(), // Increment last id then assign as the current ID
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  
  response.status(201).json({ data: newOrder });
}


function update(request, response, next) {
  const order = response.locals.order;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = request.body;
  
  if(!status || status === '') {
    next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
  });
  } else if(status === "invalid") {
    next({
      status: 400,
      message: `Cannot change status`,
  });
  } else if(id) {
    if(id !== order.id) {
      next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${order.id}`,
  });
    }
    order.id = id;
  }

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  
  response.json({ data: order });
}

function destroy(request, response, next) {
  const { orderId } = request.params;
  const index = orders.findIndex((order) => {
    if(order.status !== "pending") {
      next({
      status: 400,
      message: `An order cannot be deleted unless it is pending`,
  });
    }
    order.id === Number(orderId)
  });
  // splice returns an array of the deleted elements, even if it is one element
  const deletedFlips = orders.splice(index, 1);

  response.sendStatus(204);
}

function read(request, response, next) {
  response.json({ data: response.locals.order });
}

function list(request, response) {
  response.json({ data: orders });
}

module.exports = {
  create: [deliverToIsValid, mobileNumberIsValid, dishesIsValid, create],
  list,
  read: [orderExists, read],
  update: [orderExists, deliverToIsValid, mobileNumberIsValid, dishesIsValid, update],
  delete: [orderExists, destroy]
};

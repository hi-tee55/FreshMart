const categoryRoutes = require("./categoryRoute");
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");

const routes = [
    categoryRoutes,
    orderRoutes,
    productRoutes,
    userRoutes
];

module.exports = routes;
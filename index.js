const express = require("express");
const path = require("path");
const logger = require("morgan");
const hbs = require("express-hbs");
const cookieParser = require("cookie-parser");

const header = require("./routes/middlewares/header");
const cookie = require("./routes/middlewares/cookie");
const install = require("./routes/middlewares/install");
const error = require("./routes/middlewares/error");

const app = express();

if (process.env.NODE_ENV !== "test") app.use(logger("dev")); //todo change in production

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Handlebars configs
app.set("view engine", "tmpl");
app.set("views", path.join(__dirname, "/templates"));
app.engine("tmpl", hbs.express4({
    partialsDir: path.join(__dirname, "/templates/partials/"),
    extname: ".tmpl"
}));

// Serving Static files
app.use(express.static(path.join(__dirname, "public")));

// Using middlewares
app.use(header, cookie, install, error);

// API Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/containers", require("./routes/api/containers"));
app.use("/api/images/", require("./routes/api/images"));
app.use("/api/volumes/", require("./routes/api/volumes"));
app.use("/api/networks/", require("./routes/api/networks"));
app.use("/api/", require("./routes/api/index"));

// SSR Routes
app.use("/install", require("./routes/web/install"));
app.use("/login", require("./routes/web/login"));
app.use("/", require("./routes/web/index"));
app.use("/containers", require("./routes/web/containers"));
app.use("/stats", require("./routes/web/stats"));
app.use("/images", require("./routes/web/images"));
app.use("/volumes", require("./routes/web/volumes"));
app.use("/networks", require("./routes/web/networks"));
app.use("/settings", require("./routes/web/settings"));

app.use("/logout", (req, res) => { res.clearCookie("liman"); res.redirect("/login"); });

app.use("*", (req, res) => { res.status(404).render("404", { title: "404" }); });

module.exports = app;
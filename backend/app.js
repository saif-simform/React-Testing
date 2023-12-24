const express = require("express");
const httpStatus = require("http-status");
const debug = require("debug")("server:server");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const CONFIG = require("./config/config"); // Load the configuartion
const mongoose = require("mongoose");
const { ValidationError } = require("express-validation");

// DATABASE Connection

(db_url = `${CONFIG.db_dialect}://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`),
  mongoose.connect(db_url, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// Initiate the app
const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

// CORS
app.use(cors());

// Load API routes
app.use("/api", routes);


app.use("/", function (req, res) {
  return res
    .status(httpStatus.NOT_FOUND)
    .send({ message: `Route does not exists` });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  if (err instanceof ValidationError) {
    // console.log("ValidationError", err.details);
    let error = err;
    try {
      if (err.details.body) {
        const body = err.details.body[0];
        const key = String(req.path).startsWith("/api")
          ? "message"
          : body.path[0];
        error = {
          [key]: body.message.replace(/"/gi, ""),
          success: false,
          data: {},
        };
      } else if (err.details.query) {
        const query = err.details.query[0];
        const key = String(req.path).startsWith("/api")
          ? "message"
          : query.path[0];
        error = {
          [key]: query.message.replace(/"/gi, ""),
          success: false,
          data: {},
        };
      } else if (err.details.params) {
        const params = err.details.params[0].replace(/"/gi, "");
        const key = String(req.path).startsWith("/api")
          ? "message"
          : params.path[0];
        error = {
          [key]: params.message.replace(/"/gi, ""),
          success: false,
          data: {},
        };
      }
    } catch (e) {
      console.log("ValidationError", e);
    }
    const status = String(req.path).startsWith("/api") ? 200 : err.statusCode;
    return res.status(status).json(error);
  }
  console.log("Error Handler", JSON.stringify(err));
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
});

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Get port from environment and store in Express.
const port = normalizePort(CONFIG.port || "3000");
app.set("port", port);



// Create HTTP server.
const http = require("http");
let server = http.createServer(app);


// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Event listener for HTTP server "error" event.

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log("Server listenning on port:", addr.port);
}
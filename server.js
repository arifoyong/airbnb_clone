const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const sequelize = require("./database.js");
const User = require("./models/user.js");
const House = require("./models/house.js");
const Review = require("./models/review.js");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const sessionStore = new SequelizeStore({
  db: sequelize,
});

// sessionStore.sync();
// House.sync();
// Review.sync();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      if (!email || !password) {
        done("Email and password required", null);
        return;
      }

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        done("User not found", null);
        return;
      }

      const valid = await user.isPasswordValid(password);

      if (!valid) {
        done("Email and password do not match", null);
        return;
      }

      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  User.findOne({ where: { email: email } }).then((user) => {
    done(null, user);
  });
});

nextApp.prepare().then(() => {
  const server = express();

  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  server.use(
    session({
      secret: "343ji43j4n3jn4jk3n", //enter a random string here
      resave: false,
      saveUninitialized: true,
      name: "nextbnb",
      cookie: {
        secure: false, //CRITICAL on localhost
        maxAge: 1 * 24 * 60 * 60 * 1000, //30 days
      },
      store: sessionStore,
    }),
    passport.initialize(),
    passport.session()
  );

  server.post("/api/auth/register", async (req, res) => {
    const { email, password, passwordconfirmation } = req.body;

    if (password !== passwordconfirmation) {
      res.end(
        JSON.stringify({ status: "error", message: "Passwords do not match" })
      );
      return;
    }

    try {
      const user = await User.create({ email, password });

      req.login(user, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: "error", message: err }));
          return;
        }

        return res.end(
          JSON.stringify({ status: "success", message: "Logged in" })
        );
      });
    } catch (error) {
      res.statusCode = 500;

      let message = "An error occurred";
      if (error.name === "SequelizeUniqueConstraintError") {
        message = "User already exists";
      }
      res.end(JSON.stringify({ status: "error", message }));
    }
  });

  server.post("/api/auth/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    return res.end(
      JSON.stringify({ status: "success", message: "logged out" })
    );
  });

  server.post("/api/auth/login", async (req, res) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(400).json({ status: "error", message: err });
      }

      if (!user) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            status: "error",
            message: "No matching credentials",
          })
        );
        return;
      }

      req.login(user, (err) => {
        if (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ status: "error", message: err }));
          return;
        }

        return res.end(
          JSON.stringify({ status: "success", message: "Logged in" })
        );
      });
    })(req, res, next);
  });

  server.get("/api/house", async (req, res) => {
    const houses = await House.findAll();

    res.status(200).json(houses);
  });

  server.get("/api/house/:id", async (req, res) => {
    const house = await House.findByPk(req.params.id);

    if (!house) res.status(404).json({ message: "Not Found" });

    const review = await Review.findAll({
      raw: true,
      where: { houseId: house.id },
    });

    if (review) {
      house.dataValues.reviews = review.map((review) => review);
      house.dataValues.reviewsCount = review.length;
    }

    res.status(200).json(house);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

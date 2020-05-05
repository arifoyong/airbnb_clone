// import { User } from "../../../models/model.js";
const User = require("../../../models/model.js").User;

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end();
    return "Method not allowed";
  }
  console.log("received request");
  console.log(req.body);
  const { email, password, passwordconfirmation } = req.body;

  if (password !== passwordconfirmation) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({ status: "error", message: "Passwords do not match" })
    );
    return;
  }

  try {
    const user = await User.create({ email, password });
    res.end(JSON.stringify({ status: "success", message: "user added" }));
  } catch (error) {
    res.statusCode = 500;
    let message = "An error occurred";

    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      message = "User already exists";
    }
    res.end(JSON.stringify({ status: "error", message }));
  }

  // res.end();
};

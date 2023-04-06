import bcrypt, { hash } from "bcrypt";
import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: `Join` });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `Password confirming is failed :(`,
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `This email/username is already taken :(`,
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: `??? Unknown Error`,
    });
  }
};
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: `Login` });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: `username doesn't exists`,
    });
  }
  const canLogin = await bcrypt.compare(password, user.password);
  if (!canLogin) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: `Wrong password :(`,
    });
  }
  console.log("Log user in! coming soon :)");
  return res.redirect("/");
};
export const see = (req, res) => res.send("See User's Profile");
export const logout = (req, res) => res.send("Log Out");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

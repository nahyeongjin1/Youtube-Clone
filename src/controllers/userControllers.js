import bcrypt, { hash } from "bcrypt";
import User from "../models/User";
import fetch from "node-fetch";

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
  const user = await User.findOne({ username, socialLoginOnly: false });
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
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const email = emailData.find(
      (email) => email.primary && email.verified
    ).email;
    if (!email) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: userData.login,
        password: "",
        name: userData.name ? userData.name : "Anonymous",
        location: userData.location,
        socialLoginOnly: true,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const see = (req, res) => res.send("See User's Profile");
export const logout = (req, res) => res.send("Log Out");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

import loginTpl from "../views/login.art";

const _handleSubmit = (router) => {
  return (event) => {
    event.preventDefault();
    router.go("/menu");
  };
};

const login = (router) => {
  return (req, res, next) => {
    res.render(loginTpl({}));
    $("#login").on("click", _handleSubmit(router));
  };
};

export default login;

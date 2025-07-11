const path = require("path");

module.exports = {
  paths: function (paths, env) {
    const isAdmin = process.env.REACT_APP_ADMIN === "true";

    if (isAdmin) {
      paths.appIndexJs = path.resolve(__dirname, "src/admin/adminIndex.js");
      paths.appHtml = path.resolve(__dirname, "public-admin/index.html");
    }

    return paths;
  },
};

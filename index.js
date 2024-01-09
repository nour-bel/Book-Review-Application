const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { authenticatedUser } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const path = req.path;

    if (path.startsWith("/customer/auth")) {
        const sessionAuth = req.session.authorization;

        if (!sessionAuth || !sessionAuth.accessToken || !sessionAuth.userName) {
            return res.status(401).send("Unauthorized access");
        }

        const isAuthenticated = authenticatedUser(sessionAuth.userName, sessionAuth.accessToken);

        if (!isAuthenticated) {
            return res.status(401).send("Unauthorized access");
        }

        next();
    } else {
       
        next();
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

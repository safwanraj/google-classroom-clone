const express = require("express")
const app = express()
const middleware = require("./middleware")
const port = process.env.PORT || 3003;
const path = require('path')
const mongoose = require("./database")
const session = require("express-session")
const favicon = require('serve-favicon')

const server = app.listen(port, () => console.log("Server Listening on " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))

const loginRoutes = require("./routes/loginRoutes")
const logoutRoutes = require("./routes/logoutRoutes")
const registerRoutes = require("./routes/registerRoots")
const classRoutes = require("./routes/classRoutes")
const assignmentRoutes = require("./routes/assignmentRoutes")
const testRoutes = require("./routes/testRoutes")
const calendarRoutes = require("./routes/calendarRoutes")
const aboutRoutes = require("./routes/aboutRoutes")


// API Endpoints
const classApi = require("./routes/api/class")
const messagesApi = require("./routes/api/messages")
const assignmentsApi = require("./routes/api/assignments")
const assignmentApi = require("./routes/api/assignment")
const testsApi = require("./routes/api/tests")
const testApi = require("./routes/api/test")


app.use("/login" , loginRoutes);
app.use("/logout", logoutRoutes)
app.use("/register" , registerRoutes);
app.use("/class" , classRoutes);
app.use("/assignment" , assignmentRoutes);
app.use("/test" , testRoutes);
app.use("/calendar" , calendarRoutes);
app.use("/about" , aboutRoutes);    


// Use API Endpoints


app.use("/api/class" , classApi);
app.use("/api/messages" , messagesApi);
app.use("/api/assignments" , assignmentsApi);
app.use("/api/assignment" , assignmentApi);
app.use("/api/tests" , testsApi);
app.use("/api/test" , testApi);

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Classroom",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }
    res.status(200).render("courses", payload);
})



//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
    res.status(200).render("error");
});
const express = require("express");
const bodyparser = require("body-parser");
const teacherRouter = require("./routes/teacherRouter");
const expressHBS = require("express-handlebars");
const path = require("path");
const teacherData = require("./models/teacherData");
const { dataFind } = require("./models/sharedFunctions");
const ifEquality = require("./views/helpers/ifEquality");

const app = express();

app.use("/images", express.static(path.join(__dirname, "./images")));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//creating handlebars engine
const hbs = expressHBS.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifEquality
  }
});

//let express know to use handlebars
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.get("/", (request, response) => {
  response.status(200).render("home.hbs", {
    layout: "hero.hbs",
    title: "Home"
  });
});

app.get("/editStaff/:id", (request, response) => {
  const { id } = request.params;
  const requiredStaff = dataFind(id, teacherData);
  if (requiredStaff) {
    response.status(200).render("addStaff.hbs", {
      layout: "navigation.hbs",
      title: "Add Staff",
      staff: requiredStaff,
      action: "/teacher/" + id,
      method: "PUT"
    });
  } else {
    response.status(400).render("Invalid Staff");
  }
});

app.get("/addStaff", (request, response) => {
  response.status(200).render("addStaff.hbs", {
    layout: "navigation.hbs",
    title: "Add Staff",
    action: "/teacher",
    method: "POST"
  });
});

app.get("/staff", (request, response) => {
  response.status(200).render("details.hbs", {
    layout: "navigation.hbs",
    title: "Staff",
    data: teacherData,
    apiroute: "/editStaff/",
    heading: "Staff Details",
    addroute: "/addStaff",
    studentLink: "student",
    add: "Add Staff"
  });
});

app.get("/staff/:id/students", (request, response) => {
  const { id } = request.params;
  const requiredStaff = dataFind(id, teacherData);
  response.status(200).render("details.hbs", {
    layout: "navigation.hbs",
    title: "Staff",
    data: requiredStaff.students,
    apiroute: "/staff/" + id + "/editStudent/",
    heading: "Student Details",
    addroute: "/staff/" + id + "/addStudent",
    add: "Add Student"
  });
});

app.get("/staff/:id/editStudent/:stu_id", (request, response) => {
  let { id, stu_id } = request.params;
  const requiredStaff = dataFind(id, teacherData);
  const requiredStudent = dataFind(stu_id, requiredStaff.students);
  if (requiredStudent) {
    response.status(200).render("addStudents.hbs", {
      layout: "navigation.hbs",
      title: "Add Student",
      data: requiredStudent,
      action: "/teacher/" + id + "/students/" + stu_id,
      method: "PUT"
    });
  } else {
    response.status(400).render("Invalid Staff");
  }
});

app.get("/staff/:id/addStudent", (request, response) => {
  const { id } = request.params;
  response.status(200).render("addStudents.hbs", {
    layout: "navigation.hbs",
    title: "Add Students",
    action: "/teacher/" + id + "/students",
    method: "POST"
  });
});

app.get("/students", (request, response) => {
  const students = [];
  teacherData.forEach(element => {
    if (element.students) {
      students.push(...element.students);
    }
  });
  response.status(200).render("students.hbs", {
    layout: "navigation.hbs",
    title: "Students",
    data: students
  });
});

app.get("/about", (request, response) => {
  response.status(200).render("about.hbs", {
    layout: "navigation.hbs",
    title: "About"
  });
});

app.use("/teacher", teacherRouter);

app.get("*", (req, res) => {
  res.status(404).send("<h1> Page Not Found </h1>");
});

app.listen(8080, (req, res) => {
  console.log("Server is up and running!!");
});

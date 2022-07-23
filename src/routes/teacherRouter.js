const express = require("express");
const teachers = require("../models/teacherData");
const studentRouter = require("./studentRouter");

const {
  validObject,
  dataFind,
  findIndex,
  Update
} = require("../models/sharedFunctions");

const teacherRouter = express.Router();

teacherRouter.use("/", studentRouter);

teacherRouter
  //Get all Teacher Data
  .get("/", (req, res) => {
    res.status(200).json({
      message: "Please find all the Teacher Data",
      data: teachers
    });
  })

  //Get Teacher Data by ID
  .get("/:id", (req, res) => {
    const { id } = req.params;
    const requiredTeacher = dataFind(id, teachers);
    if (requiredTeacher) {
      res.status(200).json({
        message: "Please find the Teacher Data",
        data: requiredTeacher
      });
    } else {
      res.status(400).send("Teacher unavailable");
    }
  })
  //Insert New Teacher Data
  .post("/", (req, res) => {
    let teacher = !Array.isArray(req.body) ? [req.body] : req.body;
    let validTeacher = teacher.filter(each => validObject(each, "teacher"));
    const id = { id: teachers.length + 1 };
    if (validTeacher.length > 0) {
      validTeacher = [{ ...id, ...validTeacher[0] }];
      teachers.push(...validTeacher);
      res.status(200).json({
        message: "New Teacher added Successfully",
        data: teachers
      });
    } else {
      res.status(400).send("Invalid Teacher Data or Teacher already exists");
    }
  })

  //Update Teacher Data by ID
  .put("/:id", (req, res) => {
    let { id } = req.params;
    id = { id: parseInt(id) };
    let teacher = !Array.isArray(req.body) ? [req.body] : req.body;
    let validTeacher = teacher.filter(each => validObject(each, "teacher"));
    if (!validTeacher.toString()) {
      res.status(400).send("Invalid Teacher Data ");
    } else if (validTeacher.length > 1) {
      res.status(406).json({
        message:
          "Only one Data can be Updated at a time,if Teacher Id is given",
        data: validTeacher
      });
    } else {
      validTeacher = [{ ...id, ...validTeacher[0] }];
      validTeacher.forEach(each => Update(each, teachers));
      res.status(200).json({
        message: "Teacher Data has been Updated Successfully",
        data: teachers
      });
    }
  });

module.exports = teacherRouter;

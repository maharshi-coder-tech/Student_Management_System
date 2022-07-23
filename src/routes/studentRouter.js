const express = require("express");
const teachers = require("../models/teacherData");

const studentRouter = express.Router();

const {
  validObject,
  dataFind,
  findIndex,
  Update
} = require("../models/sharedFunctions");

studentRouter
  //Insert Student Data against respective Teacher
  .post("/:id/students", (req, res) => {
    let student = !Array.isArray(req.body) ? [req.body] : req.body;
    let validStudent = student.filter(each => validObject(each, "student"));
    let { id } = req.params;
    const requiredTeacher = dataFind(id, teachers);
    if (requiredTeacher) {
      requiredTeacher["students"] =
        typeof requiredTeacher.students === "undefined"
          ? []
          : requiredTeacher.students;
      validStudent = validStudent.filter(
        each => !requiredTeacher.students.find(next => next.id === each.id)
      );
      if (validStudent.length > 0) {
        const id = { id: requiredTeacher.students.length + 1 };
        validStudent = [{ ...id, ...validStudent[0] }];
        requiredTeacher.students.push(...validStudent);
        res.status(200).json({
          message: "New Student added Successfully",
          data: requiredTeacher
        });
      } else {
        res.status(400).send("Invalid Student Data or Student already exists");
      }
    } else {
      res.status(400).send("Invalid Teacher ID");
    }
  })
  //Update Student Data against respective Teacher
  .put("/:id/students/:studentId", (req, res) => {
    let student = !Array.isArray(req.body) ? [req.body] : req.body;
    let { id, studentId } = req.params;
    let validStudent = student.filter(each => validObject(each, "student"));
    validStudent = [{ id: parseInt(studentId), ...validStudent[0] }];
    studentId = parseInt(studentId);
    const requiredTeacher = dataFind(id, teachers);
    if (requiredTeacher) {
      requiredTeacher["students"] =
        typeof requiredTeacher.students === "undefined"
          ? []
          : requiredTeacher.students;
      validStudent = validStudent.filter(each =>
        requiredTeacher.students.find(next => next.id === each.id)
      );
      const requiredStudent = dataFind(studentId, requiredTeacher.students);
      if (!validStudent.toString() || !requiredStudent) {
        res.status(400).send("Invalid Student Data or Student already exists");
      } else if (validStudent.length > 1 && requiredStudent) {
        res.status(406).json({
          message:
            "Only one Data can be Updated at a time,if Student Id is given",
          data: requiredTeacher
        });
      } else {
        validStudent.forEach(each => Update(each, requiredTeacher.students));
        res.status(200).json({
          message: "Student Data has been Updated Successfully",
          data: requiredTeacher
        });
      }
    } else {
      res.status(400).send("Invalid Teacher ID");
    }
  });

module.exports = studentRouter;

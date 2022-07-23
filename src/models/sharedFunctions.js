const teacherBase = [
  "id",
  "firstName",
  "lastName",
  "age",
  "email",
  "class",
  "students",
  "gender"
];
const studentBase = ["id", "firstName", "lastName", "age", "email", "gender"];

const validObject = (objects, type) => {
  let objectKeys = Object.keys(objects);
  let arrayBase = type === "teacher" ? teacherBase : studentBase;
  if (objectKeys.length > 0) {
    if (objectKeys.includes("firstName")) {
      if (objectKeys.every(each => arrayBase.includes(each))) {
        if (type === "teacher") {
          if (
            typeof objects.students === "undefined"
              ? false
              : objects.students.length
          ) {
            if (objects.students.every(each => validObject(each, "student")))
              return true;
            else return false;
          } else return true;
        }
        return true;
      }
    }
    return false;
  }
  return false;
};

const dataFind = (id, array) => {
  const dataId = parseInt(id);
  return array.find(each => each.id === dataId);
};

const findIndex = (array, id) => {
  let index;
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
};

const Update = (arrays, splicingArray) => {
  const { id } = arrays;
  const teacherId = parseInt(id);
  let requiredTeacherIndex = findIndex(splicingArray, teacherId);
  if (typeof requiredTeacherIndex !== "undefined") {
    const originalTeacher = splicingArray[requiredTeacherIndex];
    const newTeacher = {
      ...originalTeacher,
      ...arrays
    };
    splicingArray.splice(requiredTeacherIndex, 1, newTeacher);
  }
};

module.exports = {
  validObject: validObject,
  dataFind: dataFind,
  findIndex: findIndex,
  Update: Update
};

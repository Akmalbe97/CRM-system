"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = require("../controller/student.controller"); // Updated import path
const router = (0, express_1.Router)();
router.post("/addStudent", student_controller_1.addStudent);
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendance = exports.addAttendance = exports.getOneAttendance = exports.getAttendance = void 0;
const uuid_1 = require("uuid");
const attendanceSchema_1 = __importDefault(require("../schema/attendanceSchema"));
const getAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupAttendance = yield attendanceSchema_1.default.find();
        res.json(groupAttendance);
    }
    catch (error) {
        res.status(500).json({
            message: "attendane not found"
        });
    }
});
exports.getAttendance = getAttendance;
////// GetOne
const getOneAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    console.log(_id);
    try {
        const attendance = yield attendanceSchema_1.default.findById(_id);
        res.json(attendance);
    }
    catch (error) {
        res.status(500).json({
            message: "attendance not found",
            error: error
        });
    }
});
exports.getOneAttendance = getOneAttendance;
///// Add
const addAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupName, subject, teacher, student } = req.body;
        // student massiv ekanligini tekshiramiz
        if (!Array.isArray(student) || student.length === 0) {
            return res.status(400).json({ message: "Student field must be a non-empty array" });
        }
        // Har bir student obyektining ichida `student_id` va `status` borligini tekshiramiz
        for (const stud of student) {
            if (!stud.student_id || typeof stud.student_id !== "string") {
                return res.status(400).json({ message: "Each student must have a valid 'student_id'." });
            }
            if (typeof stud.status !== "boolean") {
                return res.status(400).json({ message: "Each student must have a valid 'status' (true/false)." });
            }
        }
        const newAttendance = yield attendanceSchema_1.default.create({
            group_id: (0, uuid_1.v4)(),
            groupName,
            subject,
            teacher,
            student, // Massiv ichidagi obyektlar saqlanadi
        });
        res.status(201).json(newAttendance);
    }
    catch (error) {
        res.status(500).json({ message: "Davomat qo'shishda xatolik yuz berdi", error: error.message });
    }
});
exports.addAttendance = addAttendance;
//// update
const updateAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, students } = req.body;
    try {
        const attendance = yield attendanceSchema_1.default.findOneAndUpdate({ groupName: req.params.groupId, date }, { $set: { students } }, { upsert: true, new: true });
        res.json(attendance);
    }
    catch (err) {
        res.status(400).json({ message: 'Davomatni saqlashda xatolik', error: err });
    }
});
exports.updateAttendance = updateAttendance;

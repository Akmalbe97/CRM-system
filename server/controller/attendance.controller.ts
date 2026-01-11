import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";
import AttendanceSchema from "../schema/attendanceSchema";

export const getAttendance = async (req:Request, res:Response, next: NextFunction) => {
  try {
    const groupAttendance = await AttendanceSchema.find();

    res.json(groupAttendance)

  } catch (error) {
    res.status(500).json({
      message:"attendane not found"
    })
  }
}

////// GetOne
export const getOneAttendance = async (req: Request, res: Response, next: NextFunction) => {
  const _id= req.params.id;
  console.log(_id);
  
  try {
    const attendance = await AttendanceSchema.findById(_id)
    res.json(attendance)
  } catch (error) {
    res.status(500).json({
      message:"attendance not found",
      error: error
    })
  }
}

///// Add
export const addAttendance = async (req: Request, res: Response, next: NextFunction) => {
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

    const newAttendance = await AttendanceSchema.create({
      group_id: uuid(),
      groupName,
      subject,
      teacher,
      student, // Massiv ichidagi obyektlar saqlanadi
    });

    res.status(201).json(newAttendance);
  } catch (error:any) {
    res.status(500).json({ message: "Davomat qo'shishda xatolik yuz berdi", error: error.message });
  }
};

//// update

export const updateAttendance = async (req: Request, res: Response) => {
  const { date, students }: {date: Date, students: string} = req.body;

  try {
    const attendance = await AttendanceSchema.findOneAndUpdate(
      { groupName: req.params.groupId, date },
      { $set: { students } },
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (err) {
    res.status(400).json({ message: 'Davomatni saqlashda xatolik', error: err });
  }
};
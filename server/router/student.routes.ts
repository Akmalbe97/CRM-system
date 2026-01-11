import { Router, Request, Response } from 'express';
import { addStudent } from '../controller/student.controller'; // Updated import path

const router = Router();

router.post("/addStudent", addStudent)

export default router;
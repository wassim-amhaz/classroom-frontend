import {Subject} from "@/types";

export const DEPARTMENTS = [
    'IT', 'HR', 'Finance', 'Marketing', 'Computer Science', 'Mathematics', 'Physics'];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept)=>({
   value: dept,
    label: dept,
}));

export const MOCK_SUBJECTS:Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        department: "Computer Science",
        description: "Fundamental concepts of programming and computer science.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        code: "MATH201",
        name: "Calculus II",
        department: "Mathematics",
        description: "Advanced calculus including integration techniques and series.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        code: "PHYS101",
        name: "General Physics I",
        department: "Physics",
        description: "Introduction to classical mechanics and thermodynamics.",
        createdAt: new Date().toISOString(),
    },
];
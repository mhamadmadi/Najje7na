import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
    readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

const courseId = "1"; // Accounting 1

const sections = [
    {
        id: "1",
        title: "Introduction to Accounting",
        order: 1,
        free: true,
        examPeriod: "partial",
        lessons: [
            { id: 1, title: "What is Accounting?", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "2",
        title: "Balance Sheet",
        order: 2,
        free: false,
        examPeriod: "partial",
        lessons: [
            { id: 1, title: "Accounting Equation", videoId: "PLACEHOLDER" },
            { id: 2, title: "Assets", videoId: "PLACEHOLDER" },
            { id: 3, title: "Liabilities", videoId: "PLACEHOLDER" },
            { id: 4, title: "Owner's Equity", videoId: "PLACEHOLDER" },
            { id: 5, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "3",
        title: "Income Statements",
        order: 3,
        free: false,
        examPeriod: "partial",
        lessons: [
            { id: 1, title: "Equation", videoId: "PLACEHOLDER" },
            { id: 2, title: "Expenses", videoId: "PLACEHOLDER" },
            { id: 3, title: "Revenues", videoId: "PLACEHOLDER" },
            { id: 4, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
            { id: 5, title: "Practice Exercise 2", videoId: "PLACEHOLDER" },
            { id: 6, title: "Assignment", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "4",
        title: "Double Entry System",
        order: 4,
        free: false,
        examPeriod: "partial",
        lessons: [
            { id: 1, title: "Debt vs Credit", videoId: "PLACEHOLDER" },
            { id: 2, title: "Transaction Analysis", videoId: "PLACEHOLDER" },
            { id: 3, title: "Journal Entries", videoId: "PLACEHOLDER" },
            { id: 4, title: "Source Documents", videoId: "PLACEHOLDER" },
            { id: 5, title: "Recording Documents", videoId: "PLACEHOLDER" },
            { id: 6, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
            { id: 7, title: "Practice Exercise 2", videoId: "PLACEHOLDER" },
            { id: 8, title: "Assignment", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "5",
        title: "Ledger Accounts",
        order: 5,
        free: false,
        examPeriod: "partial",
        lessons: [
            { id: 1, title: "General Ledger", videoId: "PLACEHOLDER" },
            { id: 2, title: "T-Accounts", videoId: "PLACEHOLDER" },
            { id: 3, title: "Posting Process", videoId: "PLACEHOLDER" },
            { id: 4, title: "Balancing Accounts", videoId: "PLACEHOLDER" },
            { id: 5, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
            { id: 6, title: "Assignment", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "6",
        title: "Trial Balance",
        order: 6,
        free: false,
        examPeriod: "final",
        lessons: [
            { id: 1, title: "Purpose of Trial Balance", videoId: "PLACEHOLDER" },
            { id: 2, title: "Preparing Trial Balance", videoId: "PLACEHOLDER" },
            { id: 3, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "7",
        title: "Purchase Operation",
        order: 7,
        free: false,
        examPeriod: "final",
        lessons: [
            { id: 1, title: "Cash Purchase", videoId: "PLACEHOLDER" },
            { id: 2, title: "Credit Purchase", videoId: "PLACEHOLDER" },
            { id: 3, title: "Purchase Invoice", videoId: "PLACEHOLDER" },
            { id: 4, title: "Purchase Return", videoId: "PLACEHOLDER" },
            { id: 5, title: "Purchase Discount", videoId: "PLACEHOLDER" },
            { id: 6, title: "Transport In (Freight In)", videoId: "PLACEHOLDER" },
            { id: 7, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
            { id: 8, title: "Cash Sales", videoId: "PLACEHOLDER" },
            { id: 9, title: "Credit Sales", videoId: "PLACEHOLDER" },
            { id: 10, title: "Sales Invoice", videoId: "PLACEHOLDER" },
            { id: 11, title: "Sales Return", videoId: "PLACEHOLDER" },
            { id: 12, title: "Sales Discount", videoId: "PLACEHOLDER" },
            { id: 13, title: "Transport Out", videoId: "PLACEHOLDER" },
            { id: 14, title: "Advance Received from Customer", videoId: "PLACEHOLDER" },
            { id: 15, title: "Practice Exercise 2", videoId: "PLACEHOLDER" },
            { id: 16, title: "Assignments", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "8",
        title: "Containers",
        order: 8,
        free: false,
        examPeriod: "final",
        lessons: [
            { id: 1, title: "What are Containers?", videoId: "PLACEHOLDER" },
            { id: 2, title: "Returnable vs Non-returnable Containers", videoId: "PLACEHOLDER" },
            { id: 3, title: "Containers with Suppliers", videoId: "PLACEHOLDER" },
            { id: 4, title: "Containers with Customers", videoId: "PLACEHOLDER" },
            { id: 5, title: "Journal Entries", videoId: "PLACEHOLDER" },
            { id: 6, title: "Container Deposit", videoId: "PLACEHOLDER" },
            { id: 7, title: "Container Return", videoId: "PLACEHOLDER" },
            { id: 8, title: "Lost Containers", videoId: "PLACEHOLDER" },
            { id: 9, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
            { id: 10, title: "Practice Exercise 2", videoId: "PLACEHOLDER" },
            { id: 11, title: "Assignments", videoId: "PLACEHOLDER" },
        ],
    },
    {
        id: "9",
        title: "Notes Receivable & Notes Payable",
        order: 9,
        free: false,
        examPeriod: "final",
        lessons: [
            { id: 1, title: "Definition", videoId: "PLACEHOLDER" },
            { id: 2, title: "Issuing Notes Receivable", videoId: "PLACEHOLDER" },
            { id: 3, title: "Journal Entries", videoId: "PLACEHOLDER" },
            { id: 4, title: "Practice Exercise 1", videoId: "PLACEHOLDER" },
            { id: 5, title: "Practice Exercise 2", videoId: "PLACEHOLDER" },
            { id: 6, title: "Assignment", videoId: "PLACEHOLDER" },
        ],
    },
];

async function seed() {
    for (const section of sections) {
        const { id, ...data } = section;
        await db.collection("courseModules").doc(courseId).collection("sections").doc(id).set(data);
        console.log(`✅ Added section ${id}: ${data.title}`);
    }
    console.log("🎉 Done seeding Accounting 1 modules!");
}

seed();
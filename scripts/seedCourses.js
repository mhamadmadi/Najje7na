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

const courses = [
    {
        id: "1",
        groupId: "accounting-1",
        language: "english",
        title: "Accounting 1 - English",
        image: "/images/Accounting 1.jpeg",
        titleOfInstructor: "Instructor",
        instructor: "Ali Hussein Issa",
        titleOfPrice: "Price",
        pricePartial: 25,
        priceFinal: 35,
        priceFull: 45,
        titleOfCourseDescription: "Course Description",
        CourseDescription: "Whether you're taking Accounting 1 at the Lebanese University or learning accounting for the first time, this course will guide you step by step through the essential concepts of financial accounting. You'll learn how businesses record transactions, prepare journal entries, post to the ledger, create trial balances, and understand financial statements through real examples and solved exercises. By the end of this course, you'll have the confidence to solve university exams and build a strong foundation for accounting 2. ",
        titleOfWhoIsThisCourseFor: "Who is this course for?",
        whoIsThisCourseFor: [
            "Lebanese University students",
            "Business Administration students",
            "Economics students",
            "Complete beginnes in accounting",
            "Students preparing for exams",
        ],
        titleOfWhatYouLearn: "What you’ll learn",
        learningPoints: [
            " Understand the Accounting Equation",
            " Record business transaction correctly",
            " Apply the Double Entry System",
            " Prepare Journal Entries",
            " Post to Ledger Accounts",
            " Prepare Trial Balance",
            " Understand Adjusting Entries",
            " Prepare Financial Statements",
            " Solve previous exams",
        ],
        university: "Lebanese University",
        subtitle: "Accounting 1: Fundamentals of Financial Accounting",
        tagline: "Getting started with accounting — from zero to confidence.",
        major: "accounting",
    },
    {
        id: "2",
        groupId: "accounting-1",
        language: "french",
        title: "Accounting 1 - Français",
        image: "/images/Accounting 1.jpeg",
        titleOfInstructor: "Instructrice",
        instructor: "Ali Hussein Issa",
        titleOfPrice: "Prix",
        pricePartial: 25,
        priceFinal: 35,
        priceFull: 45,
        titleOfCourseDescription: "Description du cours",
        CourseDescription: "Que vous suiviez le cours de Comptabilité 1 à l'Université Libanaise ou que vous découvriez la comptabilité pour la première fois, cette formation vous guidera étape par étape à travers les concepts fondamentaux de la comptabilité financière. Vous apprendrez à enregistrer les opérations comptables, préparer les écritures de journal, effectuer le report au grand livre, établir la balance de vérification et comprendre les états financiers à l'aide d'exemples concrets et d'exercices corrigés. À la fin de ce cours, vous serez capable de réussir vos examens universitaires et de construire une base solide pour la Comptabilité 2.",
        titleOfWhoIsThisCourseFor: "À qui s'adresse ce cours ?",
        whoIsThisCourseFor: [
            "Étudiants de l'Université Libanaise",
            "Étudiants en administration des affaires",
            "Étudiants en économie",
            "Débutants complets en comptabilité",
            "Étudiants préparant leurs examens",
        ],
        titleOfWhatYouLearn: "Ce que vous allez apprendre",
        learningPoints: [
            "Comprendre l'équation comptable",
            "Enregistrer correctement les opérations comptables",
            "Appliquer le système de la partie double",
            "Préparer les écritures de journal",
            "Reporter les écritures au grand livre",
            "Préparer la balance de vérification",
            "Comprendre les écritures d'ajustement",
            "Préparer les états financiers",
            "Résoudre les examens des années précédentes",
        ],
        university: "Université Libanaise",
        subtitle: "Comptabilité 1 : Les Fondements de la Comptabilité Financière (FR)",
        tagline: "Commencez la comptabilité — de zéro à la maîtrise.",
        major: "accounting",
    },
    {
        id: "3",
        groupId: "accounting-2",
        language: "english",
        title: "Accounting 2 - English",
        image: "/images/Accounting 2.jpeg",
        titleOfInstructor: "Instructor",
        instructor: "Ali Hussein Issa",
        titleOfPrice: "Price",
        pricePartial: 25,
        priceFinal: 35,
        priceFull: 45,
        titleOfCourseDescription: "Course Description",
        CourseDescription: "Take your accounting knowledge to the next level by mastering the complete accounting cycle. This course focuses on adjusting entries, depreciation, bad debts, inventory valuation, and closing entries through practical examples and university-level exercises.Designed specifically for Lebanese University students, this course prepares you for exams with detailed explanations, solved exercises, quizzes, and previous exam questions.",
        titleOfWhoIsThisCourseFor: "Who is this course for?",
        whoIsThisCourseFor: [
            "Students who completed Accounting 1",
            "Lebanese University Busiess Administration students",
            "Economics students",
            "Students preparing for Accounting 2 exams",
        ],
        titleOfWhatYouLearn: "What you’ll learn",
        learningPoints: [
            " Prepare adjusting entries",
            " Calculate depreciation using different methods",
            " Account for bad debts and allowance for doubtful accounts",
            " Record inventory adjustments",
            " Prepare worksheet and closing entries",
            " Prepare financial statements",
            " Solve comprehensive accounting problems",
        ],
        university: "Lebanese University",
        subtitle: "Accounting 2: Fundamentals of Financial Accounting",
        tagline: "Getting started with accounting — from zero to confidence.",
        major: "accounting",
    },
    {
        id: "4",
        groupId: "accounting-2",
        language: "french",
        title: "Accounting 2 - Français",
        image: "/images/Accounting 2.jpeg",
        titleOfInstructor: "Instructrice",
        instructor: "Ali Hussein Issa",
        titleOfPrice: "Prix",
        pricePartial: 25,
        priceFinal: 35,
        priceFull: 45,
        titleOfCourseDescription: "Description du cours",
        CourseDescription: "Approfondissez vos connaissances en comptabilité en maîtrisant l'ensemble du cycle comptable. Ce cours se concentre sur les écritures d'ajustement, l'amortissement, les créances douteuses, l'évaluation des stocks et les écritures de clôture à travers des exemples pratiques et des exercices de niveau universitaire. Conçu spécialement pour les étudiants de l'Université Libanaise, ce cours vous prépare aux examens grâce à des explications détaillées, des exercices corrigés, des quiz et des questions d'examens précédents.",
        titleOfWhoIsThisCourseFor: "À qui s'adresse ce cours ?",
        whoIsThisCourseFor: [
            "Étudiants ayant terminé Comptabilité 1",
            "Étudiants en administration des affaires de l'Université Libanaise",
            "Étudiants en économie",
            "Étudiants préparant les examens de Comptabilité 2",
        ],
        titleOfWhatYouLearn: "Ce que vous apprendrez",
        learningPoints: [
            "Préparer les écritures d'ajustement",
            "Calculer les amortissements selon différentes méthodes",
            "Comptabiliser les créances douteuses et la provision pour créances douteuses",
            "Enregistrer les ajustements de stocks",
            "Préparer la feuille de travail et les écritures de clôture",
            "Préparer les états financiers",
            "Résoudre des problèmes comptables complets",
        ],
        university: "Université Libanaise",
        subtitle: "Comptabilité 2 : Comptabilité Financière Avancée",
        tagline: "Approfondissez vos compétences comptables étape par étape.",
        major: "accounting",
    },
];

async function seed() {
    for (const course of courses) {
        const { id, ...data } = course;
        await db.collection("courses").doc(id).set(data);
        console.log(`✅ Added course ${id}: ${data.title}`);
    }
    console.log("🎉 Done seeding courses!");
}

seed();
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

const course2Sections = [
    { id: "1", title: "Introduction à la comptabilité", order: 1, free: true, examPeriod: "partial",
        lessons: [{ id: 1, title: "Qu'est-ce que la comptabilité ?", videoId: "PLACEHOLDER" }] },
    { id: "2", title: "Le bilan", order: 2, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "L'équation comptable", videoId: "PLACEHOLDER" },
            { id: 2, title: "Les actifs", videoId: "PLACEHOLDER" },
            { id: 3, title: "Les passifs", videoId: "PLACEHOLDER" },
            { id: 4, title: "Les capitaux propres", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
        ]},
    { id: "3", title: "Le compte de résultat", order: 3, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "L'équation", videoId: "PLACEHOLDER" },
            { id: 2, title: "Les charges", videoId: "PLACEHOLDER" },
            { id: 3, title: "Les produits", videoId: "PLACEHOLDER" },
            { id: 4, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercice pratique 2", videoId: "PLACEHOLDER" },
            { id: 6, title: "Devoir", videoId: "PLACEHOLDER" },
        ]},
    { id: "4", title: "Le système de la partie double", order: 4, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Débit et crédit", videoId: "PLACEHOLDER" },
            { id: 2, title: "Analyse des transactions", videoId: "PLACEHOLDER" },
            { id: 3, title: "Écritures de journal", videoId: "PLACEHOLDER" },
            { id: 4, title: "Pièces justificatives", videoId: "PLACEHOLDER" },
            { id: 5, title: "Enregistrement des documents", videoId: "PLACEHOLDER" },
            { id: 6, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
            { id: 7, title: "Exercice pratique 2", videoId: "PLACEHOLDER" },
            { id: 8, title: "Devoir", videoId: "PLACEHOLDER" },
        ]},
    { id: "5", title: "Le grand livre", order: 5, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Le grand livre général", videoId: "PLACEHOLDER" },
            { id: 2, title: "Les comptes en T", videoId: "PLACEHOLDER" },
            { id: 3, title: "Le processus de report", videoId: "PLACEHOLDER" },
            { id: 4, title: "L'équilibrage des comptes", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
            { id: 6, title: "Devoir", videoId: "PLACEHOLDER" },
        ]},
    { id: "6", title: "La balance de vérification", order: 6, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Objectif de la balance de vérification", videoId: "PLACEHOLDER" },
            { id: 2, title: "Préparation de la balance de vérification", videoId: "PLACEHOLDER" },
            { id: 3, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
        ]},
    { id: "7", title: "Les opérations d'achat et de vente", order: 7, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Achat au comptant", videoId: "PLACEHOLDER" },
            { id: 2, title: "Achat à crédit", videoId: "PLACEHOLDER" },
            { id: 3, title: "Facture d'achat", videoId: "PLACEHOLDER" },
            { id: 4, title: "Retour sur achats", videoId: "PLACEHOLDER" },
            { id: 5, title: "Remise sur achats", videoId: "PLACEHOLDER" },
            { id: 6, title: "Frais de transport sur achats", videoId: "PLACEHOLDER" },
            { id: 7, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
            { id: 8, title: "Conteneurs perdus", videoId: "PLACEHOLDER" },
            { id: 9, title: "Vente au comptant", videoId: "PLACEHOLDER" },
            { id: 10, title: "Vente à crédit", videoId: "PLACEHOLDER" },
            { id: 11, title: "Facture de vente", videoId: "PLACEHOLDER" },
            { id: 12, title: "Retour sur ventes", videoId: "PLACEHOLDER" },
            { id: 13, title: "Remise sur ventes", videoId: "PLACEHOLDER" },
            { id: 14, title: "Frais de transport sur ventes", videoId: "PLACEHOLDER" },
            { id: 15, title: "Avance reçue du client", videoId: "PLACEHOLDER" },
            { id: 16, title: "Exercice pratique 2", videoId: "PLACEHOLDER" },
            { id: 17, title: "Devoirs", videoId: "PLACEHOLDER" },
        ]},
    { id: "8", title: "Les conteneurs", order: 8, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Que sont les conteneurs ?", videoId: "PLACEHOLDER" },
            { id: 2, title: "Conteneurs consignés et non consignés", videoId: "PLACEHOLDER" },
            { id: 3, title: "Conteneurs avec les fournisseurs", videoId: "PLACEHOLDER" },
            { id: 4, title: "Conteneurs avec les clients", videoId: "PLACEHOLDER" },
            { id: 5, title: "Écritures de journal", videoId: "PLACEHOLDER" },
            { id: 6, title: "Consigne sur conteneurs", videoId: "PLACEHOLDER" },
            { id: 7, title: "Retour des conteneurs", videoId: "PLACEHOLDER" },
            { id: 8, title: "Conteneurs perdus", videoId: "PLACEHOLDER" },
            { id: 9, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
            { id: 10, title: "Exercice pratique 2", videoId: "PLACEHOLDER" },
            { id: 11, title: "Devoirs", videoId: "PLACEHOLDER" },
        ]},
    { id: "9", title: "Effets à recevoir et effets à payer", order: 9, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Définition", videoId: "PLACEHOLDER" },
            { id: 2, title: "Émission des effets à recevoir", videoId: "PLACEHOLDER" },
            { id: 3, title: "Écritures de journal", videoId: "PLACEHOLDER" },
            { id: 4, title: "Exercice pratique 1", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercice pratique 2", videoId: "PLACEHOLDER" },
            { id: 6, title: "Devoir", videoId: "PLACEHOLDER" },
        ]},
];

const course3Sections = [
    { id: "1", title: "Course Review", order: 1, free: true, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Review of Accounting 1", videoId: "PLACEHOLDER" },
            { id: 2, title: "Accounting Cycle Overview", videoId: "PLACEHOLDER" },
            { id: 3, title: "Journal & Ledger Review", videoId: "PLACEHOLDER" },
        ]},
    { id: "2", title: "Depreciation", order: 2, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Fixed Assets", videoId: "PLACEHOLDER" },
            { id: 2, title: "Useful Life", videoId: "PLACEHOLDER" },
            { id: 3, title: "Residual Value", videoId: "PLACEHOLDER" },
            { id: 4, title: "Residual Value", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercises", videoId: "PLACEHOLDER" },
        ]},
    { id: "3", title: "Disposal and Exchange", order: 3, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Disposal Fixed Assets", videoId: "PLACEHOLDER" },
            { id: 2, title: "Exchange Fixed Assets", videoId: "PLACEHOLDER" },
            { id: 3, title: "Exercises", videoId: "PLACEHOLDER" },
            { id: 4, title: "Quiz", videoId: "PLACEHOLDER" },
        ]},
    { id: "4", title: "Inventory", order: 4, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "What is inventory?", videoId: "PLACEHOLDER" },
            { id: 2, title: "Rules", videoId: "PLACEHOLDER" },
            { id: 3, title: "Cost Of Goods Sold", videoId: "PLACEHOLDER" },
            { id: 4, title: "Provision", videoId: "PLACEHOLDER" },
            { id: 5, title: "Journal Entry", videoId: "PLACEHOLDER" },
        ]},
    { id: "5", title: "Inventory of receivables customers", order: 5, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Type of receivable", videoId: "PLACEHOLDER" },
            { id: 2, title: "Provision", videoId: "PLACEHOLDER" },
            { id: 3, title: "Journal Entry", videoId: "PLACEHOLDER" },
        ]},
    { id: "6", title: "Inventory of Financial Instrument", order: 6, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Definition of financial instruments", videoId: "PLACEHOLDER" },
            { id: 2, title: "Journal Entry", videoId: "PLACEHOLDER" },
            { id: 3, title: "Provision", videoId: "PLACEHOLDER" },
            { id: 4, title: "Disposal of financial instruments", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercises", videoId: "PLACEHOLDER" },
            { id: 6, title: "Quiz", videoId: "PLACEHOLDER" },
        ]},
    { id: "7", title: "bank & Cash reconciliation", order: 7, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "cash Inventory Reconciliation", videoId: "PLACEHOLDER" },
            { id: 2, title: "Cases", videoId: "PLACEHOLDER" },
            { id: 3, title: "Journal Entry", videoId: "PLACEHOLDER" },
            { id: 4, title: "Bank Reconciliation", videoId: "PLACEHOLDER" },
            { id: 5, title: "Journal Entry", videoId: "PLACEHOLDER" },
        ]},
    { id: "8", title: "Revenue and Expenses inventory", order: 8, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Introduction", videoId: "PLACEHOLDER" },
            { id: 2, title: "Cases", videoId: "PLACEHOLDER" },
            { id: 3, title: "Exercises", videoId: "PLACEHOLDER" },
            { id: 4, title: "Quiz", videoId: "PLACEHOLDER" },
        ]},
];

const course4Sections = [
    { id: "1", title: "Révision du cours", order: 1, free: true, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Révision de Comptabilité 1", videoId: "PLACEHOLDER" },
            { id: 2, title: "Vue d'ensemble du cycle comptable", videoId: "PLACEHOLDER" },
            { id: 3, title: "Révision du journal et du grand livre", videoId: "PLACEHOLDER" },
        ]},
    { id: "2", title: "Amortissement", order: 2, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Immobilisations", videoId: "PLACEHOLDER" },
            { id: 2, title: "Durée de vie utile", videoId: "PLACEHOLDER" },
            { id: 3, title: "Valeur résiduelle", videoId: "PLACEHOLDER" },
            { id: 4, title: "Méthodes d'amortissement", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercices", videoId: "PLACEHOLDER" },
        ]},
    { id: "3", title: "Cession et échange des immobilisations", order: 3, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Cession des immobilisations", videoId: "PLACEHOLDER" },
            { id: 2, title: "Échange des immobilisations", videoId: "PLACEHOLDER" },
            { id: 3, title: "Exercices", videoId: "PLACEHOLDER" },
            { id: 4, title: "Quiz", videoId: "PLACEHOLDER" },
        ]},
    { id: "4", title: "Les stocks", order: 4, free: false, examPeriod: "partial",
        lessons: [
            { id: 1, title: "Qu'est-ce qu'un stock ?", videoId: "PLACEHOLDER" },
            { id: 2, title: "Règles d'évaluation", videoId: "PLACEHOLDER" },
            { id: 3, title: "Coût des marchandises vendues", videoId: "PLACEHOLDER" },
            { id: 4, title: "Provision", videoId: "PLACEHOLDER" },
            { id: 5, title: "Écriture de journal", videoId: "PLACEHOLDER" },
        ]},
    { id: "5", title: "Créances clients", order: 5, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Types de créances", videoId: "PLACEHOLDER" },
            { id: 2, title: "Provision pour créances douteuses", videoId: "PLACEHOLDER" },
            { id: 3, title: "Écriture de journal", videoId: "PLACEHOLDER" },
        ]},
    { id: "6", title: "Instruments financiers", order: 6, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Définition des instruments financiers", videoId: "PLACEHOLDER" },
            { id: 2, title: "Écriture de journal", videoId: "PLACEHOLDER" },
            { id: 3, title: "Provision", videoId: "PLACEHOLDER" },
            { id: 4, title: "Cession des instruments financiers", videoId: "PLACEHOLDER" },
            { id: 5, title: "Exercices", videoId: "PLACEHOLDER" },
            { id: 6, title: "Quiz", videoId: "PLACEHOLDER" },
        ]},
    { id: "7", title: "Rapprochement bancaire et de caisse", order: 7, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Rapprochement de caisse", videoId: "PLACEHOLDER" },
            { id: 2, title: "Cas pratiques", videoId: "PLACEHOLDER" },
            { id: 3, title: "Écriture de journal", videoId: "PLACEHOLDER" },
            { id: 4, title: "Rapprochement bancaire", videoId: "PLACEHOLDER" },
            { id: 5, title: "Écriture de journal", videoId: "PLACEHOLDER" },
        ]},
    { id: "8", title: "Régularisation des produits et des charges", order: 8, free: false, examPeriod: "final",
        lessons: [
            { id: 1, title: "Introduction", videoId: "PLACEHOLDER" },
            { id: 2, title: "Cas pratiques", videoId: "PLACEHOLDER" },
            { id: 3, title: "Exercices", videoId: "PLACEHOLDER" },
            { id: 4, title: "Quiz", videoId: "PLACEHOLDER" },
        ]},
];

async function seedCourse(courseId, sections) {
    for (const section of sections) {
        const { id, ...data } = section;
        await db.collection("courseModules").doc(courseId).collection("sections").doc(id).set(data);
        console.log(`✅ Course ${courseId} — Added section ${id}: ${data.title}`);
    }
}

async function seedAll() {
    await seedCourse("2", course2Sections);
    await seedCourse("3", course3Sections);
    await seedCourse("4", course4Sections);
    console.log("🎉 Done seeding courses 2, 3, and 4!");
}

seedAll();
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const crypto = require("crypto");

initializeApp();

const db = getFirestore();
const BUNNY_TOKEN_KEY = defineSecret("BUNNY_TOKEN_KEY");

const BUNNY_LIBRARY_ID = "801409";

exports.getLessonPlayback = onCall(
  {
    secrets: [BUNNY_TOKEN_KEY],
    maxInstances: 10,
  },
  async (request) => {
    const { courseId, sectionId, lessonId } = request.data || {};

    if (
      typeof courseId !== "string" ||
      typeof sectionId !== "string" ||
      typeof lessonId !== "string"
    ) {
      throw new HttpsError("invalid-argument", "Invalid lesson information.");
    }

    const lessonDocId = `${courseId}_${sectionId}_${lessonId}`;

    const lessonSnap = await db
      .collection("lessonVideos")
      .doc(lessonDocId)
      .get();

    if (!lessonSnap.exists) {
      throw new HttpsError("not-found", "Lesson not found.");
    }

    const lesson = lessonSnap.data();

    const isFree = lesson.free === true;

    if (!isFree) {
      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Please sign in.");
      }

      const uid = request.auth.uid;

      const userSnap = await db.collection("users").doc(uid).get();
      const isAdmin = userSnap.exists && userSnap.data().role === "admin";

      if (!isAdmin) {
        const enrollmentSnap = await db
          .collection("enrollments")
          .doc(`${uid}_${courseId}`)
          .get();

        if (!enrollmentSnap.exists) {
          throw new HttpsError("permission-denied", "Course access required.");
        }

        const accessLevel = enrollmentSnap.data().accessLevel;

        if (
          accessLevel !== "full" &&
          accessLevel !== lesson.examPeriod
        ) {
          throw new HttpsError("permission-denied", "Lesson access denied.");
        }
      }
    }

    if (!lesson.bunnyVideoId) {
      throw new HttpsError("not-found", "Video is not available.");
    }

    const expires = Math.floor(Date.now() / 1000) + 3600;
    const tokenKey = BUNNY_TOKEN_KEY.value();

    const token = crypto
      .createHash("sha256")
      .update(tokenKey + lesson.bunnyVideoId + expires)
      .digest("hex");

    const embedUrl =
      `https://player.mediadelivery.net/embed/` +
      `${BUNNY_LIBRARY_ID}/${lesson.bunnyVideoId}` +
      `?token=${token}&expires=${expires}`;

    return { embedUrl, expires };
  }
);

exports.assignStudentId = onCall(
  {
    maxInstances: 10,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Please sign in."
      );
    }

    const uid = request.auth.uid;
    const userRef = db.collection("users").doc(uid);
    const counterRef = db.collection("counters").doc("studentIds");

    try {
      const studentId = await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists) {
          throw new HttpsError(
            "not-found",
            "User profile not found."
          );
        }

        const userData = userSnap.data();

        if (userData.role !== "student") {
          throw new HttpsError(
            "permission-denied",
            "Only student accounts can receive student IDs."
          );
        }

        // Don't generate a new ID if the student already has one.
        if (userData.studentId) {
          return userData.studentId;
        }

        const counterSnap = await transaction.get(counterRef);

        if (!counterSnap.exists || counterSnap.data().migrationComplete !== true) {
          throw new HttpsError("failed-precondition", "Student ID migration has not been completed.");
        }

        const nextNumber = (counterSnap.data().lastNumber || 0) + 1;

        const newStudentId =
          `NA-${String(nextNumber).padStart(4, "0")}`;

        transaction.set(
          counterRef,
          { lastNumber: nextNumber },
          { merge: true }
        );

        transaction.update(userRef, {
          studentId: newStudentId,
        });

        return newStudentId;
      });

      return { studentId };

    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }

      console.error("Student ID generation failed:", error);

      throw new HttpsError(
        "internal",
        "Could not generate student ID."
      );
    }
  }
);

exports.migrateStudentIds = onCall(
  {
    maxInstances: 1,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Please sign in.");
    }

    // Only admins can run this migration.
    const adminSnap = await db
      .collection("users")
      .doc(request.auth.uid)
      .get();

    if (!adminSnap.exists || adminSnap.data().role !== "admin") {
      throw new HttpsError(
        "permission-denied",
        "Only admins can migrate student IDs."
      );
    }

    const usersRef = db.collection("users");
    const counterRef = db.collection("counters").doc("studentIds");

    try {
      const result = await db.runTransaction(async (transaction) => {
        // Read all existing user documents.
        const usersSnap = await transaction.get(usersRef);
        const counterSnap = await transaction.get(counterRef);

        const students = usersSnap.docs
          .filter((userDoc) => userDoc.data().role === "student")
          .sort((a, b) => a.id.localeCompare(b.id));

        let lastNumber = counterSnap.exists
          ? Number(counterSnap.data().lastNumber) || 0
          : 0;

        // Preserve existing IDs and find the highest assigned number.
        for (const student of students) {
          const existingId = student.data().studentId;
          const match =
            typeof existingId === "string"
              ? existingId.match(/^NA-(\d+)$/)
              : null;

          if (match) {
            lastNumber = Math.max(lastNumber, Number(match[1]));
          }
        }

        let assignedCount = 0;

        // Assign IDs only to students who don't already have one.
        for (const student of students) {
          if (student.data().studentId) {
            continue;
          }

          lastNumber++;

          const studentId =
            `NA-${String(lastNumber).padStart(4, "0")}`;

          transaction.update(student.ref, {
            studentId,
          });

          assignedCount++;
        }

        // Mark migration as complete and save the final counter.
        transaction.set(
          counterRef,
          {
            lastNumber,
            migrationComplete: true,
          },
          { merge: true }
        );

        return {
          totalStudents: students.length,
          assignedCount,
          lastNumber,
        };
      });

      console.log("Student ID migration completed:", result);

      return result;
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }

      console.error("Student ID migration failed:", error);

      throw new HttpsError(
        "internal",
        "Could not migrate student IDs."
      );
    }
  }
);

const { getAuth } = require("firebase-admin/auth");

exports.deleteStudent = onCall(async (request) => {
    const uid = request.auth?.uid;
    if (!uid) throw new HttpsError("unauthenticated", "Please log in.");

    const caller = await db.doc(`users/${uid}`).get();
    if (!caller.exists || caller.data().role !== "admin") {
        throw new HttpsError("permission-denied", "Admins only.");
    }

    const { studentId } = request.data || {};
    if (!studentId) throw new HttpsError("invalid-argument", "Missing studentId.");

    const target = await db.doc(`users/${studentId}`).get();
    if (target.exists && target.data().role === "admin") {
        throw new HttpsError("failed-precondition", "Can't delete an admin.");
    }

    const enrollments = await db.collection("enrollments").where("userId", "==", studentId).get();
    const batch = db.batch();
    enrollments.forEach(d => batch.delete(d.ref));
    batch.delete(db.doc(`users/${studentId}`));
    await batch.commit();

    try {
        await getAuth().deleteUser(studentId);
    } catch (e) {
        if (e.code !== "auth/user-not-found") throw e;
    }
    return { ok: true };
});

const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// /**
//  * Initiate a recursive delete of documents at a given path.
//  *
//  * The calling user must be authenticated and have the custom "admin" attribute
//  * set to true on the auth token.
//  *
//  * This delete is NOT an atomic operation and it's possible
//  * that it may fail after only deleting some documents.
//  *
//  * @param {string} data.path the document or collection path to delete.
//  */

// exports.recursiveDelete = functions
//   .runWith({
//     timeoutSeconds: 540,
//     memory: '2GB'
//   })
//   .https.onCall((data, context) => {
//     const path = data.path
//     console.log(
//       `User ${context.auth.uid} has requested to delete path ${path}`
//     )
//
//     // Run a recursive delete on the given document or collection path.
//     // The 'token' must be set in the functions config, and can be generated
//     // at the command line by running 'firebase login:ci'.
//     return firebase_tools.firestore
//       .delete(path, {
//         project: process.env.GCLOUD_PROJECT,
//         recursive: true,
//         yes: true,
//         token: functions.config().fb.token
//       })
//       .then(() => {
//         return {
//           path: path
//         };
//       });
//   });

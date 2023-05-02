


// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios');










//---------------------------------------------------------------
 
  exports.importGameData = functions.https.onRequest((req, res) => {
    const gameName = req.query.gameName;
    const fileName = `${gameName}.csv`;
    const collectionRef = admin.firestore().collection('gameList');
  
    if (typeof gameName !== 'string' || gameName.trim().length === 0) {
      res.status(400).send('The "gameName" parameter must be a non-empty string.');
      return;
    }
  
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (row) => {
        const data = { ...row };
        console.log(`Imported ${fileName} to Firestore.`);
        collectionRef.doc(gameName).set(data);
        res.status(200).send(`Imported ${fileName} to Firestore.`);
      });
  });


//---------------------------------------------------------------


  exports.importGameTeams = functions.https.onRequest((req, res) => {
    const gameName = req.query.gameName;
    const fileName = `${gameName}Teams.csv`;
    const teamListRef = admin.database().ref(`@teamList/${gameName}`);
  
    if (typeof gameName !== 'string' || gameName.trim().length === 0) {
      res.status(400).send('The "gameName" parameter must be a non-empty string.');
      return;
    }
  
    const rows = {};
    fs.createReadStream(fileName)
      .pipe(csv())
      .on('data', (row) => {
        const teamId = row['teamId'];
        if (typeof teamId === 'string' && teamId.trim().length > 0) {
          rows[teamId] = row;
        }
      })
      .on('end', () => {
        teamListRef.set(rows);
        console.log(`Imported ${fileName} to Realtime Database.`);
        res.status(200).send(`Imported ${fileName} to Realtime Database.`);
      });
  });
        
 //---------------------------------------------------------------
 
exports.importGame = functions.https.onRequest(async (req, res) => {
    try {
      // Get the gameName parameter from the URL
      const gameName = req.query.gameName;
  
      const importGameData = admin.httpsCallable('importGameData');
      const result = await importGameData({ gameName });
  
      // Respond with a success message
      res.status(200).send(`Imported game data and teams for ${gameName} successfully!`);
    } catch (error) {
      // Respond with an error message if the function fails
      console.error(error);
      res.status(500).send(`Failed to import game data and teams for ${gameName}. Reason: ${error.message}`);
    }
  });   


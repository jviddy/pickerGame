const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');
const ejs = require('ejs');

admin.initializeApp();

exports.importGame = functions.https.onRequest((req, res) => {
  const gameName = req.query.gameName;
  const setupFile = `${gameName}Setup.csv`;
  const teamsFile = `${gameName}Teams.csv`;

  const gameRef = admin.database().ref(`gameList/${gameName}`);
  gameRef.once('value', snapshot => {
    if (snapshot.exists()) {
      res.send(`Game ${gameName} already exists.`);
      return;
    }

    const setupData = [];
    fs.createReadStream(setupFile)
      .pipe(csv({ columns: true }))
      .on('data', row => setupData.push(row))
      .on('end', () => {
        gameRef.set(setupData[0]);
        //res.send(`Game ${gameName} added to gameList.`);
      });
  }, err => {
    console.error(err);
    res.status(500).send('Error checking gameList collection.');
  });

  const teamRef = admin.database().ref(`teamList/${gameName}`);
  teamRef.once('value', snapshot => {
    if (snapshot.exists()) {
      res.send(`Game ${gameName} already exists.`);
      return;
    }

    const teamData = {};
    fs.createReadStream(teamsFile)
      .pipe(csv({ columns: true }))
      .on('data', row => {
        const teamId = row.teamId;
        if (!teamData[teamId]) {
            teamData[teamId] = {};
        }
        delete row.teamId;
        teamData[teamId] = row;
      }) // missing opening curly brace here
      .on('end', () => {
        teamRef.set(teamData);
        res.send(`Game ${gameName} added to teamList.`);
      });
  }, err => {
    console.error(err);
    res.status(500).send('Error checking teamList collection.');
  });
});


//------------------------------------------------------------------------------

exports.index = functions.https.onRequest((req, res) => {
    const pageTitle = 'My Website';
    const pageContent = 'Welcome to my website!';
  
    ejs.renderFile('./views/index.ejs', { pageTitle: pageTitle, pageContent: pageContent }, function(err, str) {
      if (err) {
        console.log(err);
        res.status(500).send('An error occurred while rendering the template.');
      } else {
        res.status(200).send(str);
      }
    });
  });
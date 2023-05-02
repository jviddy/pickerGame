const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs');
const csv = require('csv-parser');

admin.initializeApp();

exports.importGame = functions.https.onRequest((req, res) => {
  const gameName = req.query.gameName;
  const setupFile = `${gameName}Setup.csv`;
  const teamsFile = `${gameName}Teams.csv`;

  admin.database().ref(`gameList/${gameName}`).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        res.send(`Game ${gameName} already exists.`);
        return;
      }

      const setupData = [];
      fs.createReadStream(setupFile)
        .pipe(csv({ columns: true }))
        .on('data', row => setupData.push(row))
        .on('end', () => {
          admin.database().ref(`gameList/${gameName}`).set(setupData[0]);
          res.send(`Game ${gameName} added to gameList.`);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error checking gameList collection.');
    });

  admin.database().ref(`teamList/${gameName}`).once('value')
    .then(snapshot => {
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
            teamData[teamId] = [];
          }
          delete row.teamId;
          teamData[teamId].push(row);
        })
        .on('end', () => {
          admin.database().ref(`teamList/${gameName}`).set(teamData);
          res.send(`Game ${gameName} added to teamList.`);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error checking teamList collection.');
    });
});

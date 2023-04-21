var gameData = []  //array of team data
var teamSelectedList = [] // list of teams selected

document.addEventListener("DOMContentLoaded", event => {

        //const app = firebase.app();
        console.log("Hello")
        addButtonListner()
        loadJSON() 
        //loadTeamData()

});


function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        
            .then(result => {
                console.log(result.user.displayName)
                const user = result.user;   
                document.write(`Hello ${user.displayName}`);   
                console.log(user)  
            })  
            .catch (console.log)
}

async function loadPickerForm(loadGameName, loadNumTeams, loadNumGroups, loadGroupsPerRow){
    //create gameVariables
    var gameName = loadGameName
    //var numTeams = loadNumTeams
    //var numGroups = loadNumGroups
    //var groupPerRow = loadGroupsPerRow
    //var teamPerGroup = numTeams / numGroups

    //reset team data array
    gameData = null;

    console.log(`Game name is ${gameName}`)

    gameDataFile = gameName + 'TeamData.csv'
    gameData = await loadTeamData(gameDataFile)

    if (gameData === null) {
        console.log("Error loading team data");
        return;
    }

    console.log("checking val passed back")
    gameData.forEach(obj => {
        console.log(obj);
    });


    //cretae table struture and load into page
    createTeamButtonTable(gameData) 

    //add event listener to team buttons
    addButtonListner()
}
  

async function loadTeamData(fileName) {
    console.log("loading team data")
    //import team data from csv file and create and array of objects
    
    const response = await fetch(fileName);
    const data = await response.text();
    
    // Use PapaParse to parse the CSV data into an array of objects
    const gameDataParse = Papa.parse(data, { header: true, dynamicTyping: true }).data;

    gameDataParse.sort((a,b) => a.TeamRef.localeCompare(b.TeamRef));

    console.log("sorted")

    gameDataParse.forEach(obj => {
        console.log(obj);
    });

return gameDataParse;
};
    

function createTeamButtonTable(teamList) {
   
      console.log("creating table")
      // Get an array of unique Group values
      const groupValues = [...new Set(teamList.map(team => team.Group))];
      
      // Create the table header row with the Group values
      let tableHeaderRow = '<tr>';
      groupValues.forEach(group => {
        tableHeaderRow += `<th>${group}</th>`;
      });
      tableHeaderRow += '</tr>';
      
      // Create the table body rows with the Country values for each Group
      let tableBodyRows = '';
      teamList.forEach(team => {
        const index = groupValues.indexOf(team.Group);
        if (index !== -1) {
          if (!tableBodyRows[index]) {
            tableBodyRows += '<tr>';
          }
          tableBodyRows += `<td><button id="${team.TeamRef}">${team.Country}</button></td>`;
          if (tableBodyRows[index].split('</td>').length - 1 === groupValues.length - 1) {
            tableBodyRows += '</tr>';
          }
        }
      });
      
      // Create the table HTML string
      const tableHTML = `
      <table>
        //<thead>${tableHeaderRow}</thead>
        <tbody>${tableBodyRows}</tbody>
      </table>
      `;
      
      console.log(tableHTML);

      // Create a new HTML table element
      const tableElement = document.createElement('table');
      
      // Set the inner HTML of the table element to the table HTML string
      tableElement.innerHTML = tableHTML;
      
      // Append the table element to the HTML document
      document.body.appendChild(tableElement);
      
}

function addButtonListner() {  //working
  /*
    call to function to check how many elements in teh array
    value of the teams in the array
    display teams selected on screen
  */

    // select all elements with class "teamButton"
  let buttons = document.querySelectorAll('.teamButton');

  // loop through the buttons and add a click event listener to each
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      // get the ID of the clicked button
      let buttonId = button.id;
      // check if the button ID is already in the array
      if (teamSelectedList.includes(buttonId)) {
        // if it is, remove it from the array
        teamSelectedList.splice(teamSelectedList.indexOf(buttonId), 1);
        // remove the "clicked" class from the button
        button.classList.remove('clicked');
      } else {
        // if it's not in the array, add it
        teamSelectedList.push(buttonId);
        // add the "clicked" class to the button
        button.classList.add('clicked');
      }
      // print the array to the console (for testing purposes)
      console.log(teamSelectedList);
    });
  });
}

function loadJSON() {
  
  fetch('sampleJSON.json')
    .then(response => response.json())
    .then(data => {
      const game = data.pickerGames.find(game => game.gameName === 'wc23');
      const teams = game.teamList.map(team => {
        const { teamName, teamRank, teamCost, teamGroup, teamId } = team;
        return { teamName, teamRank, teamCost, teamGroup, teamId };
      });
      console.log(teams); // or do whatever you want with the teams array
    })
    .catch(error => console.error(error));
}
document.addEventListener("DOMContentLoaded", event => {

        //const app = firebase.app();
        console.log("Hello")
        //loadTeamData()

});

var gameData = []

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
    var numTeams = loadNumTeams
    var numGroups = loadNumGroups
    var groupPerRow = loadGroupsPerRow
    var teamPerGroup = numTeams / numGroups
  
    //reset team data array
    gameData.splice(0, gameData.length)
  
    console.log(`Game name is ${gameName}`)
  
    gameDataFile = gameName + 'TeamData.csv'
    gameData = await loadTeamData(gameDataFile)
  
    console.log("checking val passed back")
    gameData.forEach(obj => {
      console.log(obj);
    });
  
    createTeamButtonTable(gameData) 
  }
  

async function loadTeamData(fileName) {
    console.log("loading team data")
    //import team data from csv file and create and array of objects
    // const teams = [
    //     {Country: 'Wales', Cost: 17, Group: 'B', Rank: 18, TeamRef: 'B4'},
    //     {Country: 'England', Cost: 15, Group: 'D', Rank: 12, TeamRef: 'D1'},
    //     {Country: 'France', Cost: 12, Group: 'A', Rank: 7, TeamRef: 'A2'},
    //     {Country: 'Germany', Cost: 16, Group: 'F', Rank: 4, TeamRef: 'F3'}
    //   ];
    // return teams;  

    
    fetch(fileName)
    .then(response => response.text())
    .then(data => {
      // Use PapaParse to parse the CSV data into an array of objects
      const gameDataParse = Papa.parse(data, { header: true, dynamicTyping: true }).data;
  
      // Loop through the array of objects and do something with each object
      gameDataParse.forEach(obj => {
        console.log(obj);
      });

      gameDataParse.sort((a,b) => a.TeamRef.localeCompare(b.TeamRef));

      console.log("sorted")
      
      gameDataParse.forEach(obj => {
        console.log(obj);
      });
      
      return gameDataParse
    });
    

}

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
        <thead>${tableHeaderRow}</thead>
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
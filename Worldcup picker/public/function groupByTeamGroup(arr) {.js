function groupByTeamGroup(arr) {
  const result = {};
  arr.forEach((obj) => {
    const teamGroup = obj.teamGroup;
    if (result[teamGroup]) {
      result[teamGroup].push(obj);
    } else {
      result[teamGroup] = [obj];
    }
  });
  return Object.values(result);
}




// Get the div element with id "button"
const buttonDiv = document.getElementById("button");

// Create a button element
const button = document.createElement("button");

// Set the button's text content
button.textContent = "Click me!";

// Append the button to the buttonDiv
buttonDiv.appendChild(button);





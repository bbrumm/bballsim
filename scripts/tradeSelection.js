function updateProposedTradeYourTeam(control) {
    //console.log("Control: ", control);
    //console.log("Control Element: ", document.getElementById(control.id));
    //console.log("Closest TR", $(control).closest('tr').find('td.rowPlayerRating').text());
    let yourPlayerName = $(control).closest('tr').find('td.rowPlayerName > a').text();
    let yourPlayerRating = $(control).closest('tr').find('td.rowPlayerRating').text();
    let yourPlayerSalary = $(control).closest('tr').find('td.rowPlayerSalary').text();
    
    let chosenPlayerSalary = document.getElementById("chosenPlayerSalary").innerHTML;

    document.getElementById("yourSelectedPlayerName").innerHTML = yourPlayerName;
    document.getElementById("yourSelectedPlayerRating").innerHTML = yourPlayerRating;
    document.getElementById("yourSelectedPlayerSalary").innerHTML = yourPlayerSalary;

    //Update the Extra Salary value
    let extraSalary = chosenPlayerSalary - yourPlayerSalary;
    /*
    console.log("Your Player Changed");
    console.log("Your Player Salary: " + yourPlayerSalary);
    console.log("Other Player Salary: " + chosenPlayerSalary);
    console.log("Extra Salary: " + extraSalary);
    */
    document.getElementById("extraSalary").innerHTML = extraSalary;

    //Update the hidden form attribute, which is used for inserting data
    document.getElementById("yourPlayerID").value = control.value;
    console.log("Your ID: ", control.value);

    let chosenPlayerRating = document.getElementById("chosenPlayerRating").innerHTML;
    validateTrade(yourPlayerRating, chosenPlayerRating, extraSalary);
}

function updateProposedTradeChosenPlayer(control) {
    let chosenPlayerName = $(control).closest('tr').find('td.rowOpenPlayerName > a').text();
    let chosenPlayerRating = $(control).closest('tr').find('td.rowOpenPlayerRating').text();
    let chosenPlayerSalary = $(control).closest('tr').find('td.rowOpenPlayerSalary').text();
    let chosenPlayerTeam = $(control).closest('tr').find('td.rowOpenPlayerTeam').text();
    
    let yourPlayerSalary = document.getElementById("yourSelectedPlayerSalary").innerHTML;

    document.getElementById("chosenPlayerName").innerHTML = chosenPlayerName;
    document.getElementById("chosenPlayerRating").innerHTML = chosenPlayerRating;
    document.getElementById("chosenPlayerSalary").innerHTML = chosenPlayerSalary;
    document.getElementById("chosenPlayerTeam").innerHTML = chosenPlayerTeam;

    //Update the Extra Salary value
    let extraSalary = chosenPlayerSalary - yourPlayerSalary;
    /*console.log("Your Player Changed");
    console.log("Your Player Salary: " + yourPlayerSalary);
    console.log("Other Player Salary: " + chosenPlayerSalary);
    console.log("Extra Salary: " + extraSalary);
    */
    document.getElementById("extraSalary").innerHTML = extraSalary;

    //Update the hidden form attribute, which is used for inserting data
    document.getElementById("chosenPlayerID").value = control.value;
    console.log("Chosen ID: ", control.value);

    let yourPlayerRating = document.getElementById("yourSelectedPlayerRating").innerHTML;
    validateTrade(yourPlayerRating, chosenPlayerRating, extraSalary);
}

function validateTrade(yourPlayerRating, chosenPlayerRating, extraSalary) {
    console.log("Your Player Rating: " + yourPlayerRating);
    console.log("Chosen Player Rating: " + chosenPlayerRating);
    //Rule: if your player rating is a little less (<10 pts), it will pass
    if (yourPlayerRating > chosenPlayerRating - 10 && extraSalary >= 0) {
        //Trade is valid
        toggleTradeButton(true);
    } else {
        //Trade is not valid
        toggleTradeButton(false);
    }
}

function toggleTradeButton(isEnabled) {
    $('#confirm_trade').prop('disabled', !isEnabled);
}
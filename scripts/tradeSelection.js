function updateProposedTradeYourTeam(control) {
    //console.log("Control: ", control);
    //console.log("Control Element: ", document.getElementById(control.id));
    //console.log("Closest TR", $(control).closest('tr').find('td.rowPlayerRating').text());
    let yourPlayerName = $(control).closest('tr').find('td.rowPlayerName > a').text();
    let yourPlayerRating = $(control).closest('tr').find('td.rowPlayerRating').text();
    let yourPlayerSalary = $(control).closest('tr').find('td.rowPlayerSalary').text();

    document.getElementById("yourSelectedPlayerName").innerHTML = yourPlayerName;
    document.getElementById("yourSelectedPlayerRating").innerHTML = yourPlayerRating;
    document.getElementById("yourSelectedPlayerSalary").innerHTML = yourPlayerSalary;

    let chosenPlayerRating = document.getElementById("chosenPlayerRating").innerHTML;
    validateTrade(yourPlayerRating, chosenPlayerRating);
}

function updateProposedTradeChosenPlayer(control) {
    let chosenPlayerName = $(control).closest('tr').find('td.rowOpenPlayerName > a').text();
    let chosenPlayerRating = $(control).closest('tr').find('td.rowOpenPlayerRating').text();
    let chosenPlayerSalary = $(control).closest('tr').find('td.rowOpenPlayerSalary').text();
    let chosenPlayerTeam = $(control).closest('tr').find('td.rowOpenPlayerTeam').text();

    document.getElementById("chosenPlayerName").innerHTML = chosenPlayerName;
    document.getElementById("chosenPlayerRating").innerHTML = chosenPlayerRating;
    document.getElementById("chosenPlayerSalary").innerHTML = chosenPlayerSalary;
    document.getElementById("chosenPlayerTeam").innerHTML = chosenPlayerTeam;

    let yourPlayerRating = document.getElementById("yourSelectedPlayerRating").innerHTML;
    validateTrade(yourPlayerRating, chosenPlayerRating);
}

function validateTrade(yourPlayerRating, chosenPlayerRating) {
    console.log("Your Player Rating: " + yourPlayerRating);
    console.log("Chosen Player Rating: " + chosenPlayerRating);
    //Rule: if your player rating is a little less (<10 pts), it will pass
    if (yourPlayerRating > chosenPlayerRating - 10) {
        toggleTradeButton(true);
    } else {
        toggleTradeButton(false);
    }
}

function toggleTradeButton(isEnabled) {
    $('#confirm_trade').prop('disabled', !isEnabled);
}
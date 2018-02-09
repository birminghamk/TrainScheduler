//On Page Load:
$(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAEALo9fqSvZSdSsVujqWNS9TC-UpKCEvA",
    authDomain: "trainscheduler-3fa1c.firebaseapp.com",
    databaseURL: "https://trainscheduler-3fa1c.firebaseio.com",
    projectId: "trainscheduler-3fa1c",
    storageBucket: "trainscheduler-3fa1c.appspot.com",
    messagingSenderId: "537057177166"
  };

  firebase.initializeApp(config);

  var database = firebase.database();


	//initial variables
		//train name
		var train = "";
		//destination
		var destination = "";
		//first train time(military time)
		var time1 = "";
		//frequency(mins)
		var frequency = 0;

	//on click-submit button
	$("#submit").on("click", function(event) {
		event.preventDefault();

		//stored in database-
		train = $("#train-input").val().trim();
		//destination
		destination = $("#destination-input").val().trim();
		//first train time(military time)
		time1 = $("#time-input").val().trim();
		//frequency(mins)
		frequency = parseInt($("#frequency-input").val().trim());

		//code for push to database
		database.ref().push({
			train: train,
			destination: destination,
			time1: time1,
			frequency: frequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		}) // END DATABASE PUSH

	}); // END SUBMIT BUTTON CLICK

	database.ref().on("child_added", function(childSnapshot) {

		console.log(childSnapshot.val().train);
		console.log(childSnapshot.val().destination);
		console.log(childSnapshot.val().time1);
		console.log("frequency" + childSnapshot.val().frequency);


	//displays errors to console if needed
	}, function (errorObject) {
		console.log("Errors handled: " + errorObject.code);

	});

	//adds new trains with table info to database when new 
	database.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
	//creates new table row with variable assigned trainRow
    var trainRow = $("<tr>");
    //appends train value from database to table data cell in variable trainName 
    var trainName = $("<td>").append(snapshot.val().train);
    //appends destination value from database to table data cell in variable destination
    var destination = $("<td>").append(snapshot.val().destination);
    //adds frequency value from database to variable tFrequency and changes to integer 
    var tFrequency = parseInt(snapshot.val().frequency);
    //appends frequncy value from database to table data cell in variable frequency
    var frequency = $("<td>").append(snapshot.val().frequency);
    //creates empty table data cell in variable nextArrival
    var nextArrival = $("<td>");
    //variable startTime that gets the time-input from user
    var startTime = snapshot.val().time1;
    //var timeArr splits time on both sides of semi-colon into array
    var timeArr = startTime.split(":");
    //variable trainTime that takes current time and converts sides of semi colon in to hours/minutes
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    //var differenceTimes that adds the difference from now to how many minutes until next train arrives
    var differenceTimes = moment().diff(trainTime, "minutes");
    //var tRemainder gets the remainder from differenceTimes and tFrequency
    var tRemainder = differenceTimes % tFrequency;
    //var tMinutes subtracts the tFrequency from the tRemainder
    tMinutes = tFrequency - tRemainder;
    //appends the next arrival time formate to nextArrival in table
    nextArrival.append(moment().add(tMinutes, 'm').format('hh:mm A'));
    //appends tMinutes to minutesAway in table
    var minutesAway = $("<td>").append(tMinutes);
    //appends td elements to trainRow
    trainRow.append(trainName, destination, frequency, nextArrival, minutesAway);
    //appends trainRow to tbody
    $("tbody").append(trainRow);


	})

}) // END DOCUMENT READY

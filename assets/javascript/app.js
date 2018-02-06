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
		console.log(childSnapshot.val().frequency);



	}, function (errorObject) {
		console.log("Errors handled: " + errorObject.code);

	});

	database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {

		$("#train-display").text(snapshot.val().train);
		$("#destination-display").text(snapshot.val().destination);
		$("#frequency-display").text(snapshot.val().frequency);
		

	})
		
}) // END DOCUMENT READY
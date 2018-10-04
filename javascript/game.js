$(document).ready(function () {

  var config = {
      apiKey: "AIzaSyAIPXu7VLQdUn95NlPAGLJWA-QXz4tGbcs",
      authDomain: "train-schedule-a3891.firebaseapp.com",
      databaseURL: "https://train-schedule-a3891.firebaseio.com",
      projectId: "train-schedule-a3891",
      storageBucket: "train-schedule-a3891.appspot.com",
      messagingSenderId: "1002018082524"
  };
  firebase.initializeApp(config);

  var db = firebase.database();
  var next_arr = "";
  var min_away = 0;
  var name = "";
  var destination = "";
  var t_time = "";
  var frequency = "";

  $("#add_train").click(function () {
      name = $("#train_name").val();
      destination = $("#dest").val();
      t_time = moment($("#train_time").val().trim(), "HH:mm").subtract(1, "years").format("X");
      frequency = $("#freq").val();
      console.log(name);
      console.log(t_time);

      $("#train_name").val("");
      $("#dest").val("");
      $("#train_time").val("");
      $("#freq").val("");

      db.ref().push({
          name: name,
          destination: destination,
          t_time: t_time,
          frequency: frequency,
          dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
  });

  function train_min() {
      db.ref().child('trains').once('value', function (snapshot) {
          snapshot.forEach(function (child_snap) {
              newTime = moment().format('X');
              db.ref('trains/' + child_snap.key).update({
                  t_time: newTime,
              })
          })
      });
  };

  setInterval(train_min, 60000);

  db.ref().child('trains').on('value', function (snapshot) {
      $('tbody').empty();

  }, function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
  });

  db.ref().orderByChild("dateAdded").on("child_added", function (snapshot) {
      // storing the snapshot.val() in a variable for convenience
      var snap_val = snapshot.val(); //snapshot value
      var t_n = snap_val.name; //train name
      var t_d = snap_val.destination;//train destination
      var t_f = snap_val.frequency;//train freq
      var t_t = snap_val.t_time;//train start time
      var diffTime = moment().diff(moment.unix(t_time), "minutes");
      console.log("diff of time " + diffTime);
      var timeRemainder = moment().diff(moment.unix(t_t), "minutes") % t_f;
      console.log(timeRemainder);
      var min = t_f - timeRemainder;
      console.log(min);
      var nextTrainArrival = moment().add(min, "m").format("hh:mm A");
      // Test for correct times and info
      console.log("min" + min);
      console.log("nxttrainarr" + nextTrainArrival);
      console.log("now" + moment().format("hh:mm A"));
      console.log("next train" + nextTrainArrival);
      console.log(moment().format("X"));

      // Append train info to table on page
      $("#train_details").append("<tr>" + "<td>" + t_n + "</td>" + "<td>" + t_d + "</td>" +
        "<td>" + t_f + "</td>" + "<td>" + nextTrainArrival + "</td>" + "<td>" + min + "</td>" + "</tr>");
      // Handle the errors

  }), function (errorObject) {
      console.log("Errors handled: " + errorObject.code);
  }

});
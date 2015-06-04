//ajax request
debugger;
var apiURL = 'http://127.0.0.1:8080/websites';
var sendRequest = function(website) {
  $.ajax({
    url: apiURL,
    type: 'POST',
    data: JSON.stringify(website),
    contentType: 'application/json',
    success: function (data) {
      console.log('success');
    },
    error: function(xhr, textStatus, error) {
      console.log(textStatus);
    }
  });
};




$(document).ready(function(){

  $('#input-form').on('submit', function(e) {
    e.preventDefault();
    var website = {url: $('#url').val()};
    console.log(website);
    sendRequest(website);
  });


});

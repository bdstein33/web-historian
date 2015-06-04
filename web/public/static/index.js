//ajax request
var apiURL = 'http://127.0.0.1:8080/websites';
var sendRequest = function(website) {
  $.ajax({
    url: apiURL,
    type: 'POST',
    data: JSON.stringify(website),
    contentType: 'text/main',
    success: function (data) {
      console.log('success');
    },
    error: function(xhr, textStatus, error) {
      console.log(xhr.responseText);
    }
  });
};




$(document).ready(function(){

  $('#input-form').on('submit', function(e) {
    e.preventDefault();
    var website = $('#url').val();
    sendRequest(website);
  });


});

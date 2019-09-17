localStorageDebug();
//window.localStorage.clear();

$('#queue-form').submit(function (event) {
    event.preventDefault();
    var service = $('#service').val();
    var queueNumber = $('#queue-number').val();
    addToQueue(service, queueNumber);
});
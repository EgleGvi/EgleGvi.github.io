$(document).ready(function(){
    loadContent("admin.html");
    loadSpecialistsInToAdminPage();
    localStorageDebug();
    //window.localStorage.clear();
});

function loadSpecialistsInToAdminPage () {
    var specialists = readFromLocalStorage(LOCAL_STORAGE_SPECIALISTS);
    if(specialists === []) {
        return;
    }
    var html = "";
    specialists.forEach(function (specialist) {
        html+='<option value="'+specialist+'">'+specialist+'</option>';
    });
    $('#service').append(html);
}

$('#queue-form').submit(function (event) {
    event.preventDefault();
    var service = $('#service').val();
    var queueNumber = $('#queue-number').val();
    addToQueue(service, queueNumber);
});

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        let lines = e.target.result;
        var data = JSON.parse(lines);
        storeSpecialists(data.specialists);
        loadSpecialistsInToAdminPage();
    }
}

function loadContent(htmlFile) {
    $(".container").load(htmlFile);
}
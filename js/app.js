$(document).ready(function(){
    localStorageDebug();
    //window.localStorage.clear();
});

function loadAdminPageData () {
    var specialists = readFromLocalStorage(LOCAL_STORAGE_SPECIALISTS);
    if(specialists === []) {
        return;
    }
    var html = "";
    specialists.forEach(function (specialist) {
        html+='<option value="'+specialist+'">'+specialist+'</option>';
    });
    $(document.getElementById("service")).html(html);
}

function loadDashboardPageData () {
    var queueData = readFromLocalStorage(LOCAL_STORAGE_QUEUE);
    if(queueData === []) {
        return;
    }
    var sortedData = [];
    queueData.forEach(function(queue){
        if(sortedData[queue.service] === undefined) {
            sortedData[queue.service] = [];
        }
        sortedData[queue.service].push(queue.queueNumber);
    });
    var html = "";
    for(var specialist in sortedData) {
        html+= drawQueueTable(specialist, sortedData[specialist]);
    }
    $(document.getElementById("dashboard-tables")).html(html);
}

$(document).on('submit', function (event) {
    var target =$(event.target);
    if(target.is('#queue-form')){
        event.preventDefault();
        var service = $(document.getElementById("service")).val();
        var queueNumber = $(document.getElementById("queue-number")).val();
        addToQueue(service, queueNumber);
    }
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
        loadAdminPageData();
    }
}

function loadContent(htmlFile) {
    clearInterval();
    $("#content").load(htmlFile, function () {
        switch (htmlFile) {
            case "admin.html":
                loadAdminPageData();
                break;
            case "dashboard.html":
                loadDashboardPageData();
                beginDashboardRefresh();
                break;
            default:
                break;
        }
    });
}

function drawQueueTable(specialist, queue) {
    var html = '<div class="one-table"><table class="table"><tr  class="thead-dark"><th>'+ specialist +'</th></tr>';
    for (var i = 0; i < queue.length; i++) {
        if (i === 0){
            html += '<tr><td>'+queue[i] + ' Aptarnaujama</td></tr>';
        }
        else {
            html += '<tr><td>'+queue[i] + '</td></tr>';
        }
    }
    html += '</table></div>';
    return html;
}

function beginDashboardRefresh() {
    window.setInterval(function(){
        loadDashboardPageData();
    }, 5000);
}
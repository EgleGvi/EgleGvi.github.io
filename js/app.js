$(document).ready(function(){
    localStorageDebug();
    //window.localStorage.clear();
});

function loadServiceDropdown () {
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

function getQueueDataGroupedBySpecialist(){
    var specialists = readFromLocalStorage(LOCAL_STORAGE_SPECIALISTS);
    if(specialists === []) {
        return [];
    }
    var sortedData = [];
    specialists.forEach(function (specialist) {
        sortedData[specialist] = [];
    });
    var queueData = readFromLocalStorage(LOCAL_STORAGE_QUEUE);
    if(queueData === []) {
        return [];
    }
    queueData.forEach(function(queue){
        if(sortedData[queue.service] === undefined) {
            sortedData[queue.service] = [];
        }
        sortedData[queue.service].push({"queueNumber" : queue.queueNumber, "finished" : queue.finished});
    });
    return sortedData;
}


function loadDashboardPageData () {
    var sortedData = getQueueDataGroupedBySpecialist();
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

$(document).on('change', function (event) {
    var target =$(event.target);
    if(target.is('.service-dropdown-js')){
        loadSelectedSpecialistQueue();
    }
});

$(document).on('click', function (event) {
    var target =$(event.target);
    if(target.is('#service-finish')){
        var specialist = target.attr("specialist");
        var queueNumber = Number(target.attr("queue-number"));
        finishQueue(specialist, queueNumber);
        loadSelectedSpecialistQueue();
    }
});

function loadSelectedSpecialistQueue () {
    var sortedData = getQueueDataGroupedBySpecialist();
    var service = $(document.getElementById("service")).val();
    var html = drawQueueTable(service, sortedData[service], true);
    $(document.getElementById("specialists-tables")).html(html);
}

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
        window.localStorage.clear();
        let lines = e.target.result;
        var data = JSON.parse(lines);
        storeSpecialists(data.specialists);
        storeQueue(data.queues);
        loadServiceDropdown();
    }
}

function loadContent(htmlFile) {
    clearInterval();
    $("#content").load(htmlFile, function () {
        switch (htmlFile) {
            case "admin.html":
                loadServiceDropdown();
                break;
            case "specialist.html":
                loadServiceDropdown();
                loadSelectedSpecialistQueue();
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

function drawQueueTable(specialist, queue, showServiceButton = false) {
    var html = '<div class="one-table"><table class="table"><tr  class="thead-dark"><th>'+ specialist +'</th></tr>';
    var printedFirstRow = false;
    for (var i = 0; i < queue.length; i++) {
        if (queue[i].finished){
            continue;
        }
        if (!printedFirstRow){
            if(showServiceButton) {
                html += '<tr><td>'+queue[i].queueNumber + ' Aptarnaujama <button specialist="'+specialist+'" queue-number="'+queue[i].queueNumber+'" id="service-finish">Aptarnauta</button></td></tr>';
            } else {
                html += '<tr><td>'+queue[i].queueNumber + ' Aptarnaujama</td></tr>';
            }

            printedFirstRow = true;
        }
        else {
            html += '<tr><td>'+queue[i].queueNumber + '</td></tr>';
        }
    }
    if(queue.length === 0 || !printedFirstRow) {
        html += '<tr><td>Eilė tuščia</td></tr>';
    }
    html += '</table></div>';
    return html;
}

function beginDashboardRefresh() {
    window.setInterval(function(){
        loadDashboardPageData();
    }, 5000);
}
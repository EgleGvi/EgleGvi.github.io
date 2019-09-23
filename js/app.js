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
    var groupedData = [];
    specialists.forEach(function (specialist) {
        groupedData[specialist] = [];
    });
    var queueData = readFromLocalStorage(LOCAL_STORAGE_QUEUE);
    if(queueData === []) {
        return [];
    }
    queueData.forEach(function(queue){
        if(groupedData[queue.service] === undefined) {
            groupedData[queue.service] = [];
        }
        groupedData[queue.service].push({"queueNumber" : queue.queueNumber, "finished" : queue.finished, "addedAt": queue.addedAt, "removedAt": queue.removedAt});
    });

    for (var specialist in groupedData) {
        var queueArray = groupedData[specialist];
        groupedData[specialist] = queueArray.sort((a,b) => a.queueNumber - b.queueNumber);
    }

    return groupedData;
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
        addToQueue(service, queueNumber, false, new Date(), null);
        showSuccessAlert("Eilės numeris "+ queueNumber + " sėkmingai pridėtas specialistui " + service + ".");
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
    } else if(target.is('#client-info-js')){
        var service = $(document.getElementById("service")).val();
        var queueNumber = Number($(document.getElementById("queue-number")).val());
        var sortedData = getQueueDataGroupedBySpecialist();
        var queue = sortedData[service];
        var resultElement = $(document.getElementById("client-result-js"));

        var found = false;
        var foundFinished = false;
        var peopleInFront = 0;
        for (var index in queue) {
            if(queue[index].queueNumber === queueNumber) {
                found = true;
                if(queue[index].finished) {
                    foundFinished = true;
                }
                break;
            }
            if(!queue[index].finished) {
                peopleInFront++;
            }
        }

        if(!found) {
            resultElement.html("Jūsų eilėje nėra.");
            return;
        }

        if(foundFinished) {
            resultElement.html("Jūsų eilė jau praėjo.");
            return;
        }

        if(peopleInFront === 0) {
            resultElement.html("Dabar yra Jūsų eilė.");
            return;
        }

        var finishedCount = 0;
        var totalTimeSpent = 0;

        for (var index in queue) {
            if(queue[index].addedAt === null || queue[index].removedAt === null) {
                continue;
            }
            var addedAt = new Date(queue[index].addedAt);
            var removedAt = new Date(queue[index].removedAt);

            if(queue[index].finished && removedAt.getTime() > addedAt.getTime()) {
                finishedCount++;
                totalTimeSpent += removedAt - addedAt;
            }
        }

        var waitTime = msToTime((totalTimeSpent / finishedCount) * peopleInFront);


        if(finishedCount === 0 || totalTimeSpent === 0) {
            resultElement.html("Priekyje Jūsų yra " + peopleInFront + " žmogus(-ės). Laukimo laikas nežinomas.");
        } else {
            resultElement.html("Priekyje Jūsų yra " + peopleInFront + " žmogus(-ės). Apytikslis laukimo laikas: " + waitTime);
        }
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
        showErrorAlert("Nepavyko įkelti duomenų failo.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        showErrorAlert("Nepavyko įkelti duomenų failo.");
    }
    else if (!input.files) {
        showErrorAlert("Nepavyko įkelti duomenų failo.");
    }
    else if (!input.files[0]) {
        showErrorAlert("Nepavyko įkelti duomenų failo.");
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
        showSuccessAlert("Pavyzdiniai duomenys sėkmingai įkelti.");
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
            case "client.html":
                loadServiceDropdown ();
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
                html += '<tr class="queue-finished"><td>'+queue[i].queueNumber + ' <button specialist="'+specialist+'" queue-number="'+queue[i].queueNumber+'" id="service-finish">Aptarnauta</button></td></tr>';
            } else {
                html += '<tr class="queue-finished"><td>'+queue[i].queueNumber + '</td></tr>';
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

function showSuccessAlert(message) {
    var alertElement = $('#alert-success-js');
    alertElement.html(message);
    alertElement.removeAttr('hidden');
    setTimeout(function() {
        alertElement.html("");
        alertElement.attr("hidden", "hidden");
    }, 5000);
}

function showErrorAlert(message) {
    var alertElement = $('#alert-error-js');
    alertElement.html(message);
    alertElement.removeAttr('hidden');
    setTimeout(function() {
        alertElement.html("");
        alertElement.attr("hidden", "hidden");
    }, 5000);
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}
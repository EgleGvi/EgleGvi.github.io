var LOCAL_STORAGE_QUEUE = 'clientQueue';
var LOCAL_STORAGE_SPECIALISTS = 'specialists';

function readFromLocalStorage (key){
    var data = window.localStorage.getItem(key);
    if(data == null) {
        return [];
    }
    return JSON.parse(data);
}

function addToQueue (service, queueNumber, finished = false) {
    var queueData = readFromLocalStorage(LOCAL_STORAGE_QUEUE);
    var newItem = {
        'service': service,
        'queueNumber': Number(queueNumber),
        'finished': finished
    };
    queueData.push(newItem);
    window.localStorage.setItem(LOCAL_STORAGE_QUEUE, JSON.stringify(queueData));
}

function finishQueue (service, queueNumber) {
    var queueData = readFromLocalStorage(LOCAL_STORAGE_QUEUE);
    queueData.forEach(function (data) {
        if (data.service === service && data.queueNumber === queueNumber && data.finished === false) {
            data.finished = true;
        }
    });
    window.localStorage.setItem(LOCAL_STORAGE_QUEUE, JSON.stringify(queueData));
}

function storeSpecialists(specialists) {
    window.localStorage.setItem(LOCAL_STORAGE_SPECIALISTS, JSON.stringify(specialists));
}

function storeQueue (queues) {
    queues.forEach(function(queue){
        addToQueue(queue.service, queue.queueNumber, queue.finished);
    });
}

function localStorageDebug() {
    console.log(JSON.stringify(readFromLocalStorage(LOCAL_STORAGE_QUEUE)));
    console.log(JSON.stringify(readFromLocalStorage(LOCAL_STORAGE_SPECIALISTS)));
}


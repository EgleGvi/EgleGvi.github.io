var LOCAL_STORAGE_QUEUE_NAME = 'clientQueue';

function getQueue (){
    var queueData = window.localStorage.getItem(LOCAL_STORAGE_QUEUE_NAME);
    if(queueData == null) {
        return [];
    }
    return JSON.parse(queueData);
}

function addToQueue (service, queueNumber) {
    var queueData = getQueue();
    var newItem = {
        'service': service,
        'queueNumber': queueNumber
    };
    queueData.push(newItem);
    window.localStorage.setItem(LOCAL_STORAGE_QUEUE_NAME, JSON.stringify(queueData));
}

function localStorageDebug() {
    console.log(JSON.stringify(getQueue()));
}
var LOCAL_STORAGE_QUEUE = 'clientQueue';
var LOCAL_STORAGE_SPECIALISTS = 'specialists';

function readFromLocalStorage (key){
    var data = window.localStorage.getItem(key);
    if(data == null) {
        return [];
    }
    return JSON.parse(data);
}

function addToQueue (service, queueNumber) {
    var queueData = readFromLocalStorage(LOCAL_STORAGE_QUEUE);
    var newItem = {
        'service': service,
        'queueNumber': queueNumber
    };
    queueData.push(newItem);
    window.localStorage.setItem(LOCAL_STORAGE_QUEUE, JSON.stringify(queueData));
}

function storeSpecialists(specialists) {
    window.localStorage.setItem(LOCAL_STORAGE_SPECIALISTS, JSON.stringify(specialists));
}


function localStorageDebug() {
    console.log(JSON.stringify(readFromLocalStorage(LOCAL_STORAGE_QUEUE)));
    console.log(JSON.stringify(readFromLocalStorage(LOCAL_STORAGE_SPECIALISTS)));
}


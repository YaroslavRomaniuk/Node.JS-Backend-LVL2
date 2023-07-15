const response = await fetch('https://api.ipify.org/?format=json');
const data = await response.json();
console.log("1: " + data.ip);
//-----------------TASK 2-----------------
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json().then((response) => { return response.ip; });
        console.log('2: User IP Address:', data);
        return data;
    }
    catch (error) {
        console.error('2: Error fetching IP:', error);
    }
}
getUserIP();
//-----------------TASK 3-----------------
// 3.1 async/await + Promise.all
(async () => {
    try {
        const urls = [
            "https://random-data-api.com/api/name/random_name",
            "https://random-data-api.com/api/name/random_name",
            "https://random-data-api.com/api/name/random_name"
        ];
        const promises = urls.map((url) => fetch(url).then((response) => response.json()).then((response) => response.name).catch(console.log.bind(console)));
        const data = await Promise.all(promises);
        console.log("3.1: " + data);
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
})();
// 3.2 async/await (without Promise.all)
(async () => {
    try {
        const urls = [
            "https://random-data-api.com/api/name/random_name",
            "https://random-data-api.com/api/name/random_name",
            "https://random-data-api.com/api/name/random_name"
        ];
        const promises = urls.map((url) => fetch(url).then((response) => response.json()).then((response) => response.name).catch(console.log.bind(console)));
        const responses = [];
        for (const requestPromise of promises) {
            try {
                const response = await requestPromise;
                responses.push(response);
            }
            catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
        console.log("3.2: " + responses);
        return responses;
    }
    catch (error) {
        console.error('Error:', error);
    }
})();
// 3.3 only Promises
function makeParallelRequestData() {
    const urls = [
        "https://random-data-api.com/api/name/random_name",
        "https://random-data-api.com/api/name/random_name",
        "https://random-data-api.com/api/name/random_name"
    ];
    const promises = urls.map((url) => fetch(url).then((response) => { return response.json(); }).then((response) => response.name).catch(console.log.bind(console)));
    return promises;
}
;
function returnParallelRequest(promisesList) {
    return new Promise((resolve, reject) => {
        const results = [];
        promisesList.forEach(function (promise) {
            promise.then(result => {
                results.push(result);
                if (results.length === promisesList.length) {
                    resolve(results);
                }
            }).catch(error => reject(console.log(error)));
        });
        return results;
    });
}
returnParallelRequest(makeParallelRequestData()).then(names => console.log("3.3: " + names));
//-----------------TASK 4-----------------
//4.1 without async/await
function makeGenderRequestData() {
    const url = "https://random-data-api.com/api/users/random_user";
    const promise = fetch(url).then((response) => { return response.json(); }).then((response) => response.gender).catch(console.log.bind(console));
    return promise;
}
;
function getFemaleGender(counter) {
    const gendersData = [];
    counter++;
    return makeGenderRequestData().then(gender => {
        gendersData.push(gender);
        if (gender === "Female") {
            console.log(`4.1: It tooks ${counter} times to get ${gender} gender`);
            return gender;
        }
        else {
            getFemaleGender(counter);
        }
    });
}
getFemaleGender(0);
//4.2 with async/await
(async () => {
    const url = "https://random-data-api.com/api/users/random_user";
    let gender;
    let counter = 0;
    while (gender !== "Female") {
        gender = await fetch(url).then((response) => { return response.json(); })
            .then((response) => response.gender).catch(console.log.bind(console));
        counter++;
    }
    console.log(`4.2: It tooks ${counter} times to get ${gender} gender`);
})();
//-----------------TASK 5-----------------
async function myFunc1(callBackFunc) {
    const yourIP = await getUserIP();
    callBackFunc(yourIP);
}
async function myFunc2() {
    const gender = await makeGenderRequestData();
    console.log("5: Your gender is " + gender);
    myFunc1(outputData);
}
function outputData(data) {
    console.log("5: Your IP is: " + data);
}
myFunc2();
//-----------------TASK 6-----------------
function func1() {
    const ip = fetch('https://api.ipify.org?format=json').then((ip) => ip.json()).then((ip) => ip.ip).catch(console.log.bind(console));
    return ip;
}
async function func2(callBackFunc) {
    const yourIP = await func1();
    callBackFunc(yourIP);
}
function outputData6(data) {
    console.log("6: Your IP is: " + data);
}
func2(outputData6);
//-----------------TASK 5 by CHAT GPT -----------------
// Функция №1, которая принимает колбэк с текущим IP
function getIPAddress(callback) {
    fetch('https://api.ipify.org/?format=json')
        .then((response) => response.json())
        .then((data) => {
        const ipAddress = data.ip;
        callback(ipAddress);
    })
        .catch((error) => {
        console.error('Ошибка при получении IP:', error);
        callback(null); // Вызываем колбэк с null в случае ошибки
    });
}
// Функция №2, которую можно использовать с помощью `await`
function getIPAddressAsync() {
    return new Promise((resolve, reject) => {
        getIPAddress((ipAddress) => {
            if (ipAddress) {
                resolve(ipAddress);
            }
            else {
                reject(new Error('Не удалось получить IP адрес.'));
            }
        });
    });
}
// Пример использования функции №2 с помощью `await`
async function exampleUsage() {
    try {
        const ipAddress = await getIPAddressAsync();
        console.log('Текущий IP:', ipAddress);
    }
    catch (error) {
        console.error('Ошибка:', error);
    }
}
// Вызываем пример использования
exampleUsage();
export {};
//# sourceMappingURL=index.js.map
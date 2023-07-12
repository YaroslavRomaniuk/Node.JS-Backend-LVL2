const response = await fetch('https://api.ipify.org/?format=json');
const data = await response.json();
console.log("1: " + data.ip);
//-----------------TASK 2-----------------
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('2: User IP Address:', data.ip);
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
export {};
//# sourceMappingURL=index.js.map
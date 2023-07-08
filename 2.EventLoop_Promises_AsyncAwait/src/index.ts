
//-----------------TASK 1-----------------
export { }

const response = await fetch('https://api.ipify.org/?format=json');
const data = await response.json();


console.log(data.ip);

//-----------------TASK 2-----------------
async function getUserIP() {

  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('User IP Address:', data.ip);
  } catch (error) {
    console.error('Error fetching IP:', error);
  }
}

getUserIP();

//-----------------TASK 3-----------------

// 3.1 async/await + Promise.all

(async () => {
  const urls = [
    "https://random-data-api.com/api/name/random_name",
    "https://random-data-api.com/api/name/random_name",
    "https://random-data-api.com/api/name/random_name"
  ];

  const promises = urls.map((url) =>
    fetch(url).then((response) => response.json()).then((response) => response.name)
  );

  const data = await Promise.all(promises);

  console.log(data);
  return data;
})();

// 3.2 async/await (without Promise.all)

(async () => {
  const urls = [
    "https://random-data-api.com/api/name/random_name",
    "https://random-data-api.com/api/name/random_name",
    "https://random-data-api.com/api/name/random_name"
  ];

  const promises = urls.map((url) =>
    fetch(url).then((response) => response.json()).then((response) => response.name)
  );

  const responses = [];

  for (const requestPromise of promises) {
    try {
      const response = await requestPromise;
      responses.push(response);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  console.log(responses);
  return responses;

})();

// 3.3 only Promises

(async () => {
  const urls = [
    "https://random-data-api.com/api/name/random_name",
    "https://random-data-api.com/api/name/random_name",
    "https://random-data-api.com/api/name/random_name"
  ];

  const promises = urls.map((url) =>
    fetch(url).then((response) => response.json()).then((response) => response.name)
  );

  const responses = [];

  for (const requestPromise of promises) {
    try {
      const response = await requestPromise;
      responses.push(response);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  console.log(responses);
  return responses;

})();



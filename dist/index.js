"use strict";
console.log("helooooo");
// 1. 
function getFirstWord(a) {
    return a.split(/ +/)[0].length;
}
console.log(getFirstWord("12345"));
// 2. 
function getUserNamings(a) {
    return {
        fullname: a.name + " " + a.surname,
        initials: a.name[0] + "." + a.surname[0]
    };
}
console.log(getUserNamings({ name: "Yaroslav", surname: "Romaniuk" }));
//# sourceMappingURL=index.js.map
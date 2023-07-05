// 1. 

function getFirstWord(a: string) {
    return a.split(/ +/)[0].length;
}

// 2. 

function getUserNamings(a: { name: string; surname: string }) {
    return {
        fullname: a.name + " " + a.surname,
        initials: a.name[0] + "." + a.surname[0]
    };
}

// 3. 

function getAllProductNames(a?: {products?:Array<{name:string}>}) {
    return a?.products?.map(prod => prod?.name) || [];
}

// 4.1

// easy way is using 'as' keyword
// hard way is ?...
function hey(a: {name():string, [anyKey: string]: any;}) {
    return "hey! i'm " + a.name();
}
hey({ name: () => "roma", cuteness: 100 })
hey({ name: () => "vasya", coolness: 100 })

// 4.2

interface AbstractPet{
    name(): string;
}

class Cat implements AbstractPet{

    constructor(protected nameCat: string, protected cuttie: boolean) {}
    name() {
        return this.nameCat; 
    } 
}

class Dog implements AbstractPet{
    
    constructor(protected nameDog: string, protected catsEaten: number) {}
    name() {
        return this.nameDog; 
    } 
}

function hey1(abstractPet: AbstractPet) {
    return "hey! i'm " + abstractPet.name();
}
let a = new Cat("myavchik", true)
let b = new Dog("gavchik", 333)
hey(a)
hey(b)

// 4.3




function hey2(a: {name: ()=> string, type: "cat", cuteness:number } | {name: ()=> string, type: "dog", coolness:number }) {
    return "hey! i'm " + a.name()
        + (a.type === "cat" ? ("cuteness: " + a.cuteness) : ("coolness: " + a.coolness))
}
hey({ name: () => "roma", type: "cat", cuteness: 100 })
hey({ name: () => "vasya", type: "dog", coolness: 100 })
 
// 5.

// google for Record type
function stringEntries(a:{} | [] ) {
    return Array.isArray(a) ? a : Object.keys(a)
}

// 6.

// you don't know Promises and async/await yet. Or do you? 
// ....can be hard, don't worry and SKIP if you do not know how to do it

async function world(a: number) {
    return "*".repeat(a)
}
const hello = async () => {
    return await world(10)
}
hello().then(r => console.log(r)).catch(e => console.log("fail"))
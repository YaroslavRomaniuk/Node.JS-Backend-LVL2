import { ObjectId } from "mongodb";

export class User {
    constructor(public login: string, public pass: string, public items: Array<Item>) {}
  }


  export class Item {
    constructor(public _id: ObjectId, public text:string, public checked:boolean) {}
  }


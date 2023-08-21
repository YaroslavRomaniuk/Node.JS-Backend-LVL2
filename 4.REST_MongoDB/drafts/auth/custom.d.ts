import session from "express-session";

declare module "express-session" {
    export interface SessionData {
        // your custom properties here
        login: { [key: string]: any }; // example property
    }
}
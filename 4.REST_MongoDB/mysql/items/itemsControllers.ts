import { Request, Response } from 'express';
import { getDBMySQL } from '../db/db';
import { Db, ObjectId } from 'mongodb';
import { Item } from '../../models/models';

interface RequestWithSession extends Request {
  session: any;
}

let db: Db;

export const getItems = async (req: RequestWithSession, res: Response) => {

};

export const addItem = async (req: RequestWithSession, res: Response) => {

};

export const changeItem = async (req: RequestWithSession, res: Response) => {

};

export const deleteItem = async (req: RequestWithSession, res: Response) => {

};
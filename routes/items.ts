import express from 'express';
import mysqlDb from '../mysqlDb';
import {Item, ItemWithoutId} from '../types';
import {imagesUpload} from '../multer';
import {ResultSetHeader} from 'mysql2';

const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('SELECT i.id, i.category_id, i.location_id, i.name FROM items AS i');

    const items = result[0] as Item[];
    return res.send(items);
  } catch (e) {
    next(e);
  }
});

itemsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('SELECT * FROM items WHERE id = ?', [id]);
    const items = result[0] as Item[];

    if(items.length === 0) {
      return res.status(404).send({error: 'No item found.'});
    }

    return res.send(items[0]);
  } catch (e) {
    next(e);
  }
});

itemsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
  try {
    if(!req.body.name || !req.body.category_id || !req.body.location_id) {
      return res.status(400).send({error: 'Name, category and location is required'});
    }

    const item: ItemWithoutId = {
      category_id: parseInt(req.body.category_id),
      location_id: parseInt(req.body.location_id),
      name: req.body.name,
      description: req.body.description ? req.body.description : null,
      image: req.file ? req.file.filename : null,
    };

    const insertResult = await mysqlDb.getConnection().query('INSERT INTO items (category_id, location_id, name, description, image) VALUES (?, ?, ?, ?, ?)', [item.category_id, item.location_id, item.name, item.description, item.image]);
    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb.getConnection().query('SELECT * FROM items WHERE id = ?', [resultHeader.insertId]);
    const items = getNewResult[0] as Item[];
    return res.send(items[0]);
  } catch (e) {
    next(e);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('DELETE FROM items WHERE id = ?', [id]);
    const resultHeader = result[0] as ResultSetHeader;

    if(resultHeader.affectedRows === 0) {
      return res.status(404).send({error: 'No item found'});
    }

    return res.send({message: 'Item was deleted successfully.'});
  } catch (e) {
    next(e);
  }
});

itemsRouter.put('/:id', imagesUpload.single('image'), async (req, res, next) => {
  try {
    const id = req.params.id;

    if(!req.body.name || !req.body.category_id || !req.body.location_id) {
      return res.status(404).send({error: 'Name, category and location is required'});
    }

    const item: ItemWithoutId = {
      category_id: parseInt(req.body.category_id),
      location_id: parseInt(req.body.location_id),
      name: req.body.name,
      description: req.body.description ? req.body.description : null,
      image: req.file ? req.file.filename : null,
    };

    const insertResult = await mysqlDb.getConnection().query('UPDATE items SET category_id = ?, location_id = ?, name = ?, description = ?, image = ? WHERE id = ?', [item.category_id, item.location_id, item.name, item.description, item.image, id]);
    const resultHeader = insertResult[0] as ResultSetHeader;

    if(resultHeader.affectedRows === 0) {
      return res.status(404).send({error: 'No item found'});
    }

    const getNewResult = await mysqlDb.getConnection().query('SELECT * FROM items WHERE id = ?', [id]);
    const items = getNewResult[0] as Item[];

    return res.send(items[0]);
  } catch (e) {
    next(e);
  }
});

export default itemsRouter;
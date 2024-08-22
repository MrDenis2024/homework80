import express from 'express';
import mysqlDb from '../mysqlDb';
import {Category, CategoryWithoutId} from '../types';
import {ResultSetHeader} from 'mysql2';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('SELECT c.id, c.title FROM categories AS c');

    const categories = result[0] as Category[];
    return res.send(categories);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = result[0] as Category[];


    if(categories.length === 0) {
      return res.status(404).send({error: 'No category found.'});
    }

    return res.send(categories[0]);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.post('/', async (req, res, next) => {
  try {
    if(!req.body.title) {
      return res.status(400).send({error: 'Title is required'});
    }

    const category: CategoryWithoutId = {
      title: req.body.title ? req.body.title : null,
      description: req.body.description,
    };

    const insertResult = await mysqlDb.getConnection().query('INSERT INTO categories (title, description) VALUES (?, ?)', [category.title, category.description]);
    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb.getConnection().query('SELECT * FROM categories WHERE id = ?', [resultHeader.insertId]);
    const categories = getNewResult[0] as Category[];
    return res.send(categories[0]);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('DELETE FROM categories WHERE id = ?', [id]);
    const resultHeader = result[0] as ResultSetHeader;

    if(resultHeader.affectedRows === 0) {
      return res.status(404).send({error: 'No category found.'});
    }

    return res.send({message: 'Category was deleted successfully.'});
  } catch (e) {
    next(e);
    return res.status(400).send({ error: 'Category cannot be deleted as it is referenced by other records.' });
  }
});

categoriesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    if(!req.body.title) {
      return res.status(400).send({error: 'Title is required'});
    }

    const category: CategoryWithoutId = {
      title: req.body.title ? req.body.title : null,
      description: req.body.description,
    };

    const insertResult = await mysqlDb.getConnection().query('UPDATE categories SET title = ?, description = ? WHERE id = ?', [category.title, category.description, id]);
    const resultHeader = insertResult[0] as ResultSetHeader;

    if(resultHeader.affectedRows === 0) {
      return res.status(404).send({error: 'No category found.'});
    }

    const getNewResult = await mysqlDb.getConnection().query('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = getNewResult[0] as Category[];

    return res.send(categories[0]);
  } catch (e) {
    next(e);
  }
});

export default categoriesRouter;
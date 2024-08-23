import express from 'express';
import mysqlDb from '../mysqlDb';
import {LocationWithoutId} from '../types';
import {ResultSetHeader} from 'mysql2';

const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res, next) => {
  try {
    const result = await mysqlDb.getConnection().query('SELECT l.id, l.title FROM locations AS l');

    const locations = result[0] as Location[];
    return res.send(locations);
  } catch (e) {
    next(e);
  }
});

locationsRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('SELECT * FROM locations WHERE id = ?', [id]);
    const locations = result[0] as Location[];

    if(locations.length === 0) {
      return res.status(404).send({error: 'No location found.'});
    }

    return res.send(locations[0]);
  } catch (e) {
    next(e);
  }
});

locationsRouter.post('/', async (req, res, next) => {
  try {
    if(!req.body.title) {
      return res.status(400).send({error: 'Title is required'});
    }

    const location: LocationWithoutId = {
      title: req.body.title,
      description: req.body.description ? req.body.description : null,
    };

    const insertResult = await mysqlDb.getConnection().query('INSERT INTO locations (title, description) VALUES (?, ?)', [location.title, location.description]);
    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb.getConnection().query('SELECT * FROM locations WHERE id = ?', [resultHeader.insertId]);
    const locations = getNewResult[0] as Location[];
    return res.send(locations[0]);
  } catch (e) {
    next(e);
  }
});

locationsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query('DELETE FROM locations WHERE id = ?', [id]);
    const resultHeader = result[0] as ResultSetHeader;

    if(resultHeader.affectedRows === 0) {
      return res.status(404).send({error: 'No locations found.'});
    }

    return res.send({message: 'Location was deleted successfully.'});
  } catch (e) {
    next(e);
  }
});

locationsRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    if(!req.body.title) {
      return res.status(400).send({error: 'Title is required'});
    }

    const location: LocationWithoutId = {
      title: req.body.title,
      description: req.body.description ? req.body.description : null,
    };

    const insertResult = await mysqlDb.getConnection().query('UPDATE locations SET title = ? , description = ? WHERE id = ?', [location.title, location.description, id]);
    const resultHeader = insertResult[0] as ResultSetHeader;

    if(resultHeader.affectedRows === 0) {
      return res.status(404).send({error: 'No locations found.'});
    }

    const getNewResult = await mysqlDb.getConnection().query('SELECT * FROM locations WHERE id = ?', [id]);
    const locations = getNewResult[0] as Location[];

    return res.send(locations[0]);
  } catch (e) {
    next(e);
  }
});

export default locationsRouter;
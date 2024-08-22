import express from 'express';
import categoriesRouter from './routes/categories';
import locations from './routes/locations';
import locationsRouter from './routes/locations';
import itemsRouter from './routes/items';

const app = express();
const port = 8000;

app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/location', locationsRouter);
app.use('/items', itemsRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
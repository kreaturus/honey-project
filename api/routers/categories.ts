import * as express from 'express';
import Category from '../models/Category';
import mongoose from 'mongoose';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Product from '../models/Product';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const lang = req.headers['accept-language'];

  try {
    const categories = await Category.aggregate([
      // { $addFields: { translations: { $objectToArray: '$translations' } } },
      // { $addFields: { lang: '$translations.k' } },
      { $unwind: '$translations' },
      // { $addFields: {
      //   content: `$translations.${lang}`
      // }
      // },
      // { replaceRoot: {} },
      // {$addFields:{"quarters.name": "$name"}},
      // {$replaceRoot:{newRoot:"$quarters"}}
    ]);

    const result = await categories;

    // categories
    //     .then((result) => {
    //       // new Category(result).save();
    //       console.log(result);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });

    return res.send(result);
  } catch (e) {
    return res.sendStatus(500);
  }
});

categoriesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  const categoryData = {
    title: req.body.title,
    description: req.body.description,
  };

  const category = new Category(categoryData);

  try {
    await category.save();
    res.send(category);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    next(e);
  }
});

categoriesRouter.put('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).send({ error: 'Not found!' });
    }

    // category.title = req.body.title || category.title;
    // category.description = req.body.description || category.description;

    await category.save();

    return res.send(category);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

categoriesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const category_id = req.params.id;
    const category = await Category.findOne({ _id: category_id });

    if (!category) {
      return res.status(404).send({ error: 'Not found!' });
    }

    const relatedProducts = await Product.find({ category: category_id });
    if (relatedProducts.length > 0) {
      return res
        .status(400)
        .send({ error: 'Cannot delete category because there are products associated with it.' });
    }

    await Category.deleteOne({ _id: category_id });
    return res.send('Category deleted');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

export default categoriesRouter;

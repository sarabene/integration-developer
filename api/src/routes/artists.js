const express = require('express');
const Joi = require('joi');

const router = express.Router();
const { Album, Artist, Genre } = require('../models');

/**
 * @swagger
 * /artists:
 *   get:
 *     summary: Get a list of artist
 *     parameters:
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: genreName
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of artist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artist'
 *       400:
 *         description: Invalid query parameters
 *
 */
router.get('/', (req, res) => {
  // Validation
  const schema = Joi.object({
    genreId: Joi.number().allow(''),
    genreName: Joi.string().allow(''),
  });
  const validation = schema.validate(req.query);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }

  // Handle case without query parameters
  if (req.query === undefined) {
    Artist.findAll().then((genres) => {
      res.status(200).send(genres);
    });
    return;
  };

  // Handle case with 'genreId' and/or 'genreName' query parameters.
  let where = {}; // Defaults to 'without query parameters'
  if (req.query.hasOwnProperty('genreId')) where.GenreId = req.query.genreId;
  if (req.query.hasOwnProperty('genreName')) where.GenreName = req.query.genreName;
  const options = {
    include: [{
      model: Album,
      as: 'Artist_Album_1',
      required: true,
      attributes: [],
    },{
      model: Genre,
      foreignKey: 'ArtistId',
      required: true,
      where: where,
      attributes: [],
    }],
  };
  Artist.findAll(options).then((artists) => {
    res.status(200).send(artists);
  });
});

module.exports = router;

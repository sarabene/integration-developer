const express = require('express');
const Joi = require('joi');

const router = express.Router();
const { Album, Artist, Sequelize } = require('../models');

/** 
 * @swagger
 * /albums:
 *   get:
 *     summary: Get a list of albums by artist
 *     description: Get a list of albums by artist. You have to provide either artistId or artistName in the query.
 *     parameters:
 *       - in: query
 *         name: artistId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: artistName
 *         schema:
 *           type: string
 *     responses:
 *       200: 
 *         description: A list of albums by the artist 
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Album'
 *       400: 
 *         description: Invalid query parameters
 * 
*/
router.get('/', (req, res) => {
  // Handle case without query parameters
  if (req.query === undefined
    || (!req.query.hasOwnProperty('artistId') && !req.query.hasOwnProperty('artistName'))
  ) {
    return res.status(400).send('You must define a query parameter. E.g. artistId or artistName');
  };

  // Validation
  const schema = Joi.object({
    artistId: Joi.number().allow(''),
    artistName: Joi.string().allow(''),
  });
  const validation = schema.validate(req.query);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }

  // Handle case with 'artistId' and/or 'artistName' query parameters.
  let where = {}; // Defaults to 'without query parameters'
  if (req.query.hasOwnProperty('artistId')) where.ArtistId = req.query.artistId;
  if (req.query.hasOwnProperty('artistName')) where.ArtistName = req.query.artistName;
  const options = {
    attributes: [
      'AlbumId',
      'AlbumName',
      [Sequelize.literal('LEFT(DateReleased, 10)'), 'DateReleased'],
      'ArtistId',
      'GenreId',
    ],
    include: [{
      model: Artist,
      as: 'Album_Artist_2',
      foreignKey: 'ArtistId',
      required: true,
      where: where,
      attributes: [],
    }],
  };
  Album.findAll(options).then((albums) => {
    res.status(200).send(albums);
  });
});

/** 
 * @swagger
 * /albums:
 *   post:
 *     summary: Create a new album
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       201: 
 *         description: The created album
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Album'
 *       400: 
 *         description: Validation error
 *       500:
 *         description: Internal Server Error
 * 
*/
router.post('/', (req, res) => {
  // Validation
  const schema = Joi.object({
    AlbumName: Joi.string().required(),
    DateReleased: Joi.string().pattern(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).required(),
    ArtistId: Joi.number().required(),
    GenreId: Joi.number().required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    res.status(400).send(validation.error.details[0].message);
    return;
  }

  Album.create(req.body).then((album) => {
    res.status(201).send(album.toJSON());
  }).catch((err) => {
    console.log(err);
    res.status(500).send('Internal Server Error. Stuff like this happens during demos...');
  });
});

module.exports = router;

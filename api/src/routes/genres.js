const express = require('express');
const { Genre } = require('../models');

const router = express.Router();

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get a list of all genres
 *     responses:
 *       200:
 *         description: A list of all genres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 */
router.get('/', (req, res) => {
  Genre.findAll().then((genres) => {
    res.status(200).send(genres);
  });
});

module.exports = router;

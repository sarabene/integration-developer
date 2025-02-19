const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const Genre = require('../models/Genre');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Yettel Music API',
      version: '1.0.0',
      description: 'API documentation for Yettel Music API',
    },
    components: {
      schemas: {
        Album: {
          type: 'object',
          properties: {
            AlbumId: {
              type: 'integer',
            },
            AlbumName: {
              type: 'string',
            },
            DateReleased: {
              type: 'string',
            },
            ArtistId: {
              type: 'integer',
            },
            GenreId: {
              type: 'integer',
            },
          },
        },
        Artist: {
          type: 'object',
          properties: {
            ArtistId: {
              type: 'integer',
            },
            ArtistName: {
              type: 'string',
            },
          },
        },
        Genre: {
          type: 'object',
          properties: {
            GenreId: {
              type: 'integer',
            },
            GenreName: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
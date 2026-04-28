const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog Platform API',
      version: '1.0.0',
      description: 'API documentation for the Mini CMS Blog Platform',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            avatar_url: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            author_id: { type: 'integer' },
            author_name: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            excerpt: { type: 'string' },
            body: { type: 'string' },
            cover_image_url: { type: 'string', nullable: true },
            status: { type: 'string' },
            published_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            categories: { 
              type: 'array', 
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  slug: { type: 'string' }
                }
              }
            },
            tags: { 
              type: 'array', 
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  slug: { type: 'string' }
                }
              }
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const specs = swaggerJsDoc(options);

module.exports = specs;

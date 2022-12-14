import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  info: {
    title: 'Conference Api',
    version: '3.0.0',
    description:'Conference API',
    license: {
      name: 'Licensed Under Omnimeet',
      url: 'https://beta.omnimeet.com/',
    },
  },
  basePath: process.env.BASE_PATH,
}

const DisableAuthorizePlugin = function() {
  return {
    wrapComponents: {
      authorizeBtn: () => () => null,
    },
  }
}

const swaggerOptions = {
  swaggerOptions: {
    plugins: [
      DisableAuthorizePlugin,
    ],
    defaultModelsExpandDepth: -1,
  },
}

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: [`${__dirname}/*.yaml`],
}

const swaggerSpec = swaggerJSDoc(options)

export {
  swaggerSpec,
  swaggerOptions,
}

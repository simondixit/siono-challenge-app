import express from 'express';
import router from './router'
import { connector } from 'swagger-routes-express';
import upload from './utils/multer';
import { removeFile } from './utils/helpers';
import YAML from 'yamljs';
import * as OpenApiValidator from 'express-openapi-validator';
import * as api from './api/controllers';

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());

    // const cors = require('cors');
    // this.server.use(cors({
    //   origin: '*'
    // }));

    // this middleware handles multer errors and validate file constrains: (file must be text/plain and below 1gb)
    this.server.use(
      '/api/v1/upload',
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        upload(req, res, (err: any) => {
          if(err || req.file.mimetype !== 'text/plain') {
            req.file && removeFile(req.file.path)
            return res.status(500).json({ message: err ? err.message : "File not supported" })
          }
          next()
        })
    })

    // swagger set ups 
    const yamlSpecFile = './config/openapi.yml',
          apiDefinition = YAML.load(yamlSpecFile),
          validatorOptions = {
            apiSpec: yamlSpecFile,
            validateRequests: true,
            validateResponses: true
          }

    this.server.use(OpenApiValidator.middleware(validatorOptions))

    // error customization, if request is invalid
    this.server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.status(err.status).json({
        error: {
          type: 'request_validation',
          message: err.message,
          errors: err.errors
        }
      })
    });

    const connect = connector(api, apiDefinition, {
      onCreateRoute: (method: string, descriptor: any[]) => {
        console.log(`${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`)
      }
    })
    
    connect(this.server)
  }

  routes() {
    this.server.use(router);
  }
}

export default new App().server;
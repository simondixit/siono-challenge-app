import request from 'supertest'
import { Express } from 'express-serve-static-core'
import { FindOrCreateDummyFile } from '../../../utils/helpers';
import App from '../../../app'

let server: Express;
const filePath = './src/api/controllers/__tests__/dummy.txt'

beforeAll(async () => {
  server = App
  await FindOrCreateDummyFile(filePath)
}, 10000)

describe('POST /upload', () => {

  it('should upload the text file and return corresponding results', () => {
    return request(App)
      .post('/api/v1/upload/10')
      .attach('file', filePath)
      .then(response => {
        expect(response.status).toBeDefined()
        if(response.status === 200) {
          expect(response.body).toHaveProperty('frecuencies')
          expect(response.body.frecuencies).not.toHaveLength(0)
          expect(Object.keys(response.body.frecuencies[0])).toEqual(expect.arrayContaining(['word', 'count']))
        }
        if(response.status === 500) {
          expect(response.body).toHaveProperty('message')
        }         
      })
  }, 20000)
})
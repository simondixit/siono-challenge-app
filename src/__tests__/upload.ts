import request from 'supertest'
import { Express } from 'express-serve-static-core'
import { FindOrCreateFile } from '../utils/helpers';
import App from '../app'

let server: Express;

const dummyFile: any = { path: './src/__tests__/dummy.txt', options: { count: 100000, size: null } }
const image: any = { path: './src/__tests__/image.jpg', options: { count: null, size: null } }

beforeAll(async () => {
  server = App
  await FindOrCreateFile(dummyFile.path, dummyFile.options)
  await FindOrCreateFile(image.path, image.options)
})

describe('POST /upload', () => {
  it('should upload the text file and return expected JSON', () => {
    return request(App)
      .post('/api/v1/upload/999')
      .attach('file', dummyFile.path)
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .then(response => {
        expect(response.body).toHaveProperty('frecuencies')
        expect(response.body.frecuencies).not.toHaveLength(0)
        expect(Object.keys(response.body.frecuencies[0])).toEqual(expect.arrayContaining(['word', 'count']))
      })
  })

  it('should returns error 500 file not supported', () => {
    return request(App)
    .post('/api/v1/upload/1')
    .attach('file', image.path)
    .expect(500)
    .then(response => {
      expect(response.body).toStrictEqual({ message: "File not supported" })
    })
  })

  it('should returns error 500 (file is missing)', () => {
    return request(App)
    .post('/api/v1/upload/1')
    .attach('file', null)
    .expect(500)
    .then(response => {
      expect(response.body).toStrictEqual({ message: "File is missing" })
    })
  })
})
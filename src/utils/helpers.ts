import { loremIpsum } from 'lorem-ipsum'
import fs from 'fs'

type Options = {
  count: number,
  size: number
}

/**
 * @param  {string} path
 * * Check if file exists and if not creates it
 */
export function FindOrCreateFile(path: string, opts: Options): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.open(path, 'r', err => {
      if (err && err.code === 'ENOENT') {

        let data: string | Buffer;

        if(opts) {
          if(opts.count) {
            const utf8Words = [
              "Ernleȝe", "liðe", "Laȝamon", "Leovenaðes", "þer", "æðelen", "Кругом", // Middle English
              "Sîne", "klâwen", "stîget", "ûf", "grôzer", "grâwen", "tägelîch", // Middle High German
              "пустынных", "бедный", "топким", "там", "лес", "солнца", "Река", // Russian
              "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", // Latin
              "Je", "peux", "manger", "du", "verre", "ça", "fait", // French
              "obras", "todo", "sol", "debajo", "es", "vanidad", "del" // Spanish
            ]
  
            data = loremIpsum({
              count: opts.count,  // Number of "words", "sentences", or "paragraphs"
              format: "plain",         // "plain" or "html"
              random: Math.random,     // A PRNG function
              suffix: "\n",            // Line ending, defaults to "\n" or "\r\n" (win32)
              units: "paragraph",      // paragraph(s), "sentence(s)", or "word(s)"
              words: utf8Words        // Array of words to draw from
            })
          }

          if(opts.size) data = Buffer.alloc(1024*1024*opts.size)
        }
  
        try {
          fs.writeFileSync(path, data ? data : '')
          resolve()       
        } catch (error) {
          console.log(error)
          reject()
        }
      }
      resolve()
    })
  })
}
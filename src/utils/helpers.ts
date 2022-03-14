import { loremIpsum } from 'lorem-ipsum'
import fs from 'fs'

/**
 * check if file exists and if not creates a new one with dummy data (utf8)
 * @param  {string} path
 */
export function FindOrCreateDummyFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.open(path, 'r', err => {
      if (err && err.code === 'ENOENT') {
        const utf8Words = [
          "Ernleȝe", "liðe", "Laȝamon", "Leovenaðes", "þer", "æðelen", "Кругом", // Middle English
          "Sîne", "klâwen", "stîget", "ûf", "grôzer", "grâwen", "tägelîch", // Middle High German
          "пустынных", "бедный", "топким", "там", "лес", "солнца", "Река", // Russian
          "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", // Latin
          "Je", "peux", "manger", "du", "verre", "ça", "fait", // French
          "obras", "todo", "sol", "debajo", "es", "vanidad", "del" // Spanish
        ]
        const dummyText = loremIpsum({
          count: 100000,           // Number of "words", "sentences", or "paragraphs"
          format: "plain",         // "plain" or "html"
          random: Math.random,     // A PRNG function
          suffix: "\n",            // Line ending, defaults to "\n" or "\r\n" (win32)
          units: "paragraph",      // paragraph(s), "sentence(s)", or "word(s)"
          words: utf8Words        // Array of words to draw from
        })
  
        try {
          fs.writeFileSync(path, dummyText)
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

/**
 * remove the specified file
 * @param  {string} path
 */
export function removeFile(path: string) {
  fs.unlink(path, err => {
    if (err) throw err;
    console.log(`${path} was deleted`);
  })
}
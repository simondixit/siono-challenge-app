import { Request, Response } from 'express'
import { removeFile } from '../../utils/helpers'

const lineReader = require('line-reader')
const TimSort = require('timsort');
 
/**
 * /api/v1/upload/{top}
 * Receive file path from multer middleware and returns top frecuency words from the file in JSON format.
 * @param  {Request} req
 * @param  {Response} res
 */
export async function upload(req: Request, res: Response): Promise<void> {
  const top = req.params.top || 1
  const filePath = req.file.path
  const result: any = await counter(filePath, Number(top))

  removeFile(filePath)
  res.json(result)
}

/**
 * frecuency word counter function
 * Receive file path and number of most frecuented words to return
 * @param  {string} path
 * @param  {number} top
 */
function counter(path: string, top: number): Promise<{ frecuencies: { word: string, count: number }[] }> {
  return new Promise(resolve => {
    let wordCounts: any = {};
    let frecuencies: { word: string, count: number }[] = [];

    // go trough each line of text file (using line-reader)
    lineReader.eachLine(path, function(line: string, last: boolean) {
      // clean up undesirables chars (spaces, tabs, dots)
      let words = line.trim().split(/[ \t\n\r\.]+/g);

      // iterate array of words and stack each one 
      for(let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase();

        if (!word) continue;
    
        if(wordCounts.hasOwnProperty(word)) {
          wordCounts[word]++;
        }
        else {
          wordCounts[word] = 1;
        }
      }

      if(last) {
        const wordList: string[] = Object.keys(wordCounts);

        // sort the most frequent words (ascending)
        TimSort.sort(wordList, (a:number, b:number) => {
          if(wordCounts[a] < wordCounts[b])
            return 1;
      
          if(wordCounts[a] === wordCounts[b] && a > b)
            return 1;
      
          return -1;
        });

        let word: string;
        let count: number;
        let length: number = wordList.length > top ? top : wordList.length

        // build up JSON to return according to the values ​​found and the top parameter
        for(let i = 0; i < length; i++) {
          word = wordList[i];
          count = wordCounts[word];
          frecuencies.push({ word, count })
        }
        
        resolve({ frecuencies });
      }
    });
  })
}
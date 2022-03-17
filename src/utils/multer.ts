import multer from 'multer'
import { Request } from 'express'

const lineReader = require('line-reader')
const TimSort = require('timsort')

interface FileResult extends Partial<Express.Multer.File> {
  frecuencies: { word: string, count: number }[];
}

class TextReaderEngine implements multer.StorageEngine {
  constructor(){};
  
    /**
   * @param  {Request} _req
   * @param  {Express.Multer.File} file
   * @param  {(error:Error|null)=>void} cb
   * * Includes the quantity requested most frequented words of the file in the object returned by multer
   */
  _handleFile = (
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: FileResult) => void
  ): void => {
    let wordCounts: any = {};

    // ! Do not use ecoding value of file since it is deprecated.
    if (file.mimetype !== 'text/plain') {
      cb(new Error("File not supported"));
      return;
    }

    // go trough each line of stream (using line-reader)
    lineReader.eachLine(file.stream, function(line: string, last: boolean) {
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
        let length: number = wordList.length > Number(req.params.top) ? Number(req.params.top) : wordList.length
        let frecuencies = []

        // build up JSON to return according to the values ​​found and the top parameter
        for(let i = 0; i < length; i++) {
          word = wordList[i];
          count = wordCounts[word];
          frecuencies.push({ word, count })
        }

        cb(null, { frecuencies })
      }
    });
  };

  
  /**
   * @param  {Request} _req
   * @param  {Express.Multer.File} file
   * @param  {(error:Error|null)=>void} cb
   * * Function not used since we are not storing the file
   * ! Do not remove, it is required by IStorageEngine
   */
  _removeFile = (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void
  ): void => {
    cb(null);
  };
}

// customized options limitations
const limits = {
  fileSize: 1000000000, //1gb
  files: 1,
}

const uploader = multer({
  storage: new TextReaderEngine(),
  limits
}).single('file')

export default uploader
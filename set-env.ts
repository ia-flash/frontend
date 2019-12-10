//import { writeFile } from 'fs'; 

const fs = require('fs');

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.prod.ts';

// Load node modules
const colors = require('colors');
require('dotenv').config()
const urlSivnorm = process.env.URL_SIVNORM || null ;
const urlMatchvec = process.env.URL_MATCHVEC || null ;

const envConfigFile = `export const environment = {
  production: true,
  apiMatchvec: '${urlMatchvec}',
  apiSivnorm: '${urlSivnorm}'
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
   }
});

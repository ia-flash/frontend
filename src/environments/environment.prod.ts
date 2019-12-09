const urlSivnorm = process.env.URL_SIVNORM || null ;
const urlMatchvec = process.env.URL_MATCHVEC || null ;

export const environment = {
  production: true,
  apiMatchvec: urlMatchvec,
  apiSivnorm: urlSivnorm
};

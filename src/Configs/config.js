// import carData from './carmovements.json';
// import ptData from './ptmovements.json';
// import walkData from './Vasastanwalk.json';
// import bikeData from './Vasastanbike.json';

const sizeLookup = {
   1: 500000,
   2: 200000,
   3: 100000,
   4: 50000,
   5: 25000,
   6: 12500,
   7: 6250,
   8: 3000,
   9: 1200,
   10: 600,
   11: 400,
   12: 200,
   13: 100,
   14: 80,
   15: 40,
   16: 20,
   17: 10,
   18: 5,
   19: 5,
   20: 5
}
const modes = [{
      name: 'car',
      outname: 'car',
      color: '#276EF1',
      color2: [39, 110, 241, 200],
      dataFile: 'carmovements.json',
      data : null,
      active: true,
      widthMinPixels:3,
      traillength: 15,
      display:true
   },
   {
      name: 'pt',
      outname: 'pt',
      color: '#E73A14',
      color2: [231, 58, 20, 200],
      dataFile : 'ptmovements.json',
      data : null,
      active: true,
      widthMinPixels:2,
      traillength: 40,
      display:true
   },
   {
      name: 'walk',
      outname: 'walk',
      color: '#25CF00',
      color2: [37, 207, 0, 200],
      dataFile : 'Vasastanwalk.json',
      //data : walkData,
      active: true,
      widthMinPixels:4,
      traillength: 15,
      display:true
   },
   {
      name: 'bike',
      outname: 'bike',
      color: '#FE00D8',
      color2: [254, 0, 126, 200],
      dataFile : 'Vasastanbike.json',
      data : null,
      active: true,
      widthMinPixels:4,
      traillength: 20,
      display:true
   },
   {
      name: 'no',
      outname: 'no',
      display: false,
      active: false,
   }
];

export {
   modes
   };

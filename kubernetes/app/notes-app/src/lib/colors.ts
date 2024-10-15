const yellow = {
  200: `#FFE4B3`,
  300: `#FFCD75`,
  400: `#FFBB48`,
  500: `#FFA800`,
  600: `#EB9B00`,
  700: `#D88F00`,
  800: `#C58200`,
  900: `#B37600`
};

const marine = {
  200: `#A3F5EF`,
  300: `#75F0E7`,
  400: `#20E9DA`,
  500: `#0BDACB`,
  600: `#10CBBC`,
  700: `#14B8AB`,
  800: `#12A195`,
  900: `#108980`
};

const cyan = {
  200: `#99E6FF`,
  300: `#6ECBF7`,
  400: `#34B4F4`,
  500: `#00A9F4`,
  600: `#0291DC`,
  700: `#0679C3`,
  800: `#0863AA`,
  900: `#084D91`
};

const blue = {
  200: '#99C4FF',
  300: '#5E9DFF',
  400: '#2972FF',
  500: '#2251FF',
  600: '#1C44DC',
  700: '#1537BA',
  800: '#0E2B99',
  900: '#061F79'
};

const gray = {
  200: '#E6E6E6',
  300: '#CCCCCC',
  400: '#B3B3B3',
  500: '#757575',
  600: '#656565',
  700: '#4D4D4D',
  800: '#333333',
  900: '#333333'
};
const deep = {
  100: '#82A6C9',
  200: '#82A6C9',
  300: '#5380AC',
  400: '#386694',
  500: '#2B5580',
  600: '#1B456E',
  700: '#103559',
  800: '#082644',
  900: '#051C2C'
};

export const mckColors = {
  blue: Object.values(blue),
  yellow: Object.values(yellow),
  depp: Object.values(deep),
  gray: Object.values(gray),
  cyan: Object.values(cyan),
  marine: Object.values(marine),
  threeLevelDark: [blue['900'], blue['500'], blue['200']],
  threeLevel: [cyan['900'], cyan['500'], cyan['200']],
  fiveLevelDark: [blue['900'], blue['700'], blue['500'], blue['300'], blue['200']],
  fiveLevel: [cyan['900'], cyan['700'], cyan['500'], cyan['300'], cyan['200']],
  sixLevel: [cyan['900'], cyan['700'], cyan['500'], cyan['300'], cyan['200'], '#FFFFFF'],
  mixedBlue: [deep['900'], blue['900'], blue['700'], blue['500'], cyan['500'], cyan['300'], cyan['200']],
  pieChart: ['#FFA800', '#E33B3B', '#0BDACB', '#DB57DB', '#CEBA97'],
  pieSubChart:[
    ['#EB9B00', '#FFA800', '#FFBB48', '#FFCD75', '#FFEECC'],
    ['#CD3030', '#E33B3B', '#E65656', '#F17E7E', '#FAA8A8'],
    ['#0AC7BA', '#0BDACB', '#0CEDDC', '#89f9f1', '#C1FCF8'],
    ['#c54ec5', '#DB57DB', '#de67de', '#e589e5', '#edabed'],
    ['#C6AF86', '#CEBA97', '#D6C6A8', '#DED1BA', '#E7DDCB']
  ]
}; 

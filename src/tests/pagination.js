const commands = {
  'a': 'a',
  'b': 'b',
  'c': 'c',
  'd': 'd',
  'e': 'e',
  'f': 'f',
  'g': 'g',
  'h': 'h',
  'i': 'i',
  'j': 'j',
}

function generatePage(page){
  page = Number(page) || 1;
  let total = Object.keys(commands).length;
  let pages = Math.ceil(total / 5);
  if(page < 1 || page > pages) page = 1;
  let list = [];
  let min = (page - 1) * 5;
  let max = min + 5;
  console.log(page);
  console.log(pages);
  for(let i = min; i < max; i++) list.push(commands[Object.keys(commands)[i]]);
  return list;
}

console.log(`[.abot8] ` + generatePage(2));

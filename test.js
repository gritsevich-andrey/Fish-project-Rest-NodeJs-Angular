
const a = 'block';
switch (a) {
    case 'block': console.log('block'); break;
    case 'none': console.log('none'); break;
    case 'inline': console.log('inline'); break;
    default: console.log('other');
}

// let b = 'hidden';
//
// if (b === 'hidden') {
//
//     b = 'visible';
//
// } else {
//
//     b = 'hidden';
//
// }
let b = 'hidden';
 const c1 = b === 'hidden' ? b = 'visible' : b = 'hidden';
console.log(c1);


let c = 0;
if (c === 0) {
    c = 1;
} else if (c < 0) {
    c = 'less then zero';
} else {
    c *= 10;
}
let c = 0;
const d = c === 0 ? с = 1 : c < 0 ? c = 'less then zero' : c *= 10;
console.log(d);

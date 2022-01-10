// function multiply(...args) {
//     if(args.length) {
//         const reducer = args.reduce((previousValue, currentValue) => previousValue*currentValue);
//         console.log(reducer);
//     }
// }
function multiply() {
    let count = 1;
    if(arguments.length > 0) {
        for(let i=0; i<arguments.length; i++)
        {
            count *= arguments[i];
        }
        console.log(count);
        return count;
    }
    else {
        return 0;
    }
}
multiply(2, 4, 5, 6);
multiply();

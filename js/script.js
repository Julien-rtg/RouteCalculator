// console.log('' + Distance('50 km').human_readable('customary'));
let MY_COORDS = {
    lat: 48.8589507, 
    lon: 2.2770205
};

let SCOPE_COORDS = {
    lat: 48.4084597,
    lon: - 4.5346199
};

let getDistance = Distance.between(MY_COORDS, SCOPE_COORDS);

console.log('' + getDistance.human_readable());

if (getDistance > Distance('800 km')) {
    console.log('Nice journey!');
}


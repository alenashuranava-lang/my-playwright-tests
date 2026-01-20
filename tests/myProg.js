import pkg from 'lodash';
const { indexOf } = pkg;
import { getName } from './myFunction.mjs';

function sayHi() {
  console.log('Hi');
}

//sayHi();

//let array = [1, 2, 3, 1, 5];
//console.log(indexOf(array, 1));
console.log(getName());
console.log(Math.min(1, 2, 3));

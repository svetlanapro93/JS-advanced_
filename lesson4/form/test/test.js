let a = 'dgkdhfgkjfhg';
const option1 = new RegExp('[a-zA-Zа-яА-ЯёЁ]', 'gi')
console.log(option1.test(a));

let b = '+7(000)000-1234'
const option2 = new RegExp(/.\d{3}.\d{3}.\d{4}/, 'gi')
console.log(option2.test(b));

let c = 'mydhxghxdhx-mail@mail.ru'
const option3 = new RegExp(/[a-z]{1,30}[.-]?mail@mail.ru/, 'gi')
console.log(option3.test(c));

let z = 'sgslzkjlskj  gddlsgjdlkgjdklfgj 9032493 lkfdjjgkdfg'
const option4 = new RegExp(/\w/, 'gim')
console.log(option4.test(z));
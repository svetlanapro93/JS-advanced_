class Param {
    name = '';
    price = 0;
    calories = 0;

    constructor(el){
        this.name = el.value;
        ({price: this.price, calories: this.calories} = Burger.burgerParams[this.name])
    }
}

class Burger {
    static burgerParams = {
        small: {price: 50, calories: 20},
        big: {price: 100, calories: 40},
        cheese: {price: 10, calories: 20},
        salad: {price: 20, calories: 5},
        potato: {price: 15, calories: 10},
        pepper: {price: 15, calories: 0},
        mayo: {price: 20, calories: 10}
    };

    size = null; //это объект
    stuffing = null; //это объект
    toppings = [];

    constructor(size, stuffing, toppings) {
        this.size = new Param(this._select(size));
        this.stuffing = new Param(this._select(stuffing));
        //select ищет элемент по name и возвращать его
        this.toppings = this._selectAll(toppings).map(el => new Param(el)); //map перебирает каждый эл-т массива созданного SelectALL
    }

    get price(){
        return this._sum('price')
    }//геттер

    get calories(){
        return this._sum('calories')
    }
    showSum(price, calories){
        document.querySelector(price).textContent = this.price
        document.querySelector(calories).textContent = this.calories
    }

    _select(name) {
        return document.querySelector(`input[name="${name}"]:checked`) //в квадратных скобках можем обратиться по атрибутам html эл-ов
    } //возвращает объект

    _selectAll(name) {
        return [...document.querySelectorAll(`input[name="${name}"]:checked`)] //возвращает массив
    }

    _sum(value){
        let result = this.size[value] + this.stuffing[value];
        this.toppings.forEach(topping => result += topping[value]);
        return result;
    }
}







    // Добавить добавку
    // addTopping(topping){
//         if(!this.topping.includes(topping)){
//             this.topping.push(topping)
//         }
//     }
//
//     // Убрать добавку
//     removeTopping(topping){
//         for (let i = 0; i < this.topping.length; i++){
//             if (this.topping[i] === topping){
//                 this.topping.splice(i, 1);
//                 break;
//             }
//         }
//
//     }
//
//     // Узнать размер гамбургера
//     getSize(){
//         return this.size;
//     }
//     // Узнать начинку гамбургера
//     getStuffing(){
//         return this.stuffing;
//     }
//     // Узнать цену
//     calculatePrice(){
//         let price = 0;
//         if (this.size) { price += this.pricelist.size[this.size].price }
//         if (this.stuffing) { price += this.pricelist.stuffing[this.stuffing].price }
//         for(let i = 0; i < this.topping.length; i++){
//             if(this.topping[i]){price += this.pricelist.topping[this.topping[i]].price }
//         }
//         return price;
//     }
//     // Узнать калорийность
//     calculateCalories(){
//         let calories = 0;
//         if (this.size) { calories += this.pricelist.size[this.size].calories }
//         if (this.stuffing) { calories += this.pricelist.stuffing[this.stuffing].calories }
//         for(let i = 0; i < this.topping.length; i++){
//             if(this.topping[i]){calories += this.pricelist.topping[this.topping[i]].calories }
//         }
//         return calories;
//     }
// }
//
// let order = new Hamburger('small', 'cheese');
//

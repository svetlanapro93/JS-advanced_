// let getRequest = (url) => {
//     return new Promise(function (resolve, reject) {
//         let xhr = new XMLHttpRequest();
//         xhr.open('GET', url, true)
//         xhr.onreadystatechange = () => {
//             if(xhr.readyState !== 4) {
//                 return
//             }
//
//             if(xhr.status !== 200){
//                 reject(console.log(`Some error: ${xhr.status} - ${xhr.responseText}`))
//             }
//             if(xhr.readyState === 4 && xhr.status === 200){
//                 resolve(xhr.responseText);
//             }
//         }
//     })
// }

class Item { //исходник товара, от него наследуются: 1) товар каталога, 2) товар корзины
    product_name = '';
    price = 0;
    id_product = 0;
    img = '';
    rendered = false;

    constructor(product, img) {
        ({product_name: this.product_name, price: this.price, id_product: this.id_product} = product);
        this.img = `https://picsum.photos/250/200?random=${this.id_product}" alt="${this.id_product}`
    }
    render(){
        this.rendered = true;
        return `<div class="product-item" data-id="${this.id_product}">
                    <img src="${this.img}" alt="${this.product_name}">
                    <figcaption>
                        <div class="desc">
                            <h3>${this.product_name}</h3>
                            <p>${this.price}</p>
                        </div>
                        <button class="buy-btn" data-id="${this.id_product}"">Купить</button>
                    <figcaption>
                </div>`
    }
}
class ProductItem extends Item {} // это товар каталога, точная копия исходника товара

class CartItem extends Item{ //это товар корзины, наследуемый от исходника товара Irem
    quantity = 0;

    constructor(product, img) {
        super(product, img)
        this.quantity = product.quantity;
    }

    changeQuantity(count) {
        this.quantity += count;
        this._updateItem();
    }

    removeMarkup() {
        document.querySelector(`.cart-item[data-id="${this.id_product}"]`).remove();
    }
    render() {
        this.rendered = true;
        return `
        <div class="cart-item" data-id="${this.id_product}">
            <img class="cart-img" src="${this.img}" alt="Some image">
            <div class="product-desc">
                <p class="product-title">${this.product_name}</p>
                <p class="product-single-price">${this.price} ₽</p>
                <p class="product-price">${this.quantity*this.price} ₽</p>
                <div class="product-desc__wrapper">
                    <p class="product-quantity">${this.quantity}</p>
                    <button class="del-btn" data-id="${this.id_product}">&times;</button>
                </div>
                
            </div>   
        </div>`
    }

    _updateItem() {
        const block = document.querySelector(`.cart-item[data-id="${this.id_product}"]`);
        block.querySelector(`.product-quantity`).textContent = `${this.quantity}`;
        block.querySelector(`.product-price`).textContent = `${this.quantity*this.price} руб.`;
    }
};

class List { // объект (исходник для каталога и для корзины)
    static itemsMap = { //храним конструкторы определенного класса
        Products: ProductItem, //products - ключ ProductItem - ссылка
        Cart: CartItem //Cart- ключ CartItem - ссылка
    };
    static API = `https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses`;

    products = [];
    container = null;
    url = '';

    constructor(selector, url) {
        this.container = document.querySelector(selector);
        this.url = url;
        this._init();
    }

    getJson(url) {
        // метод получения любых json данных (по любому заданному url). Если url передан, используем строго его,
        //если нет - тогда исполоьзуем  API + url заданный в конструкторе
        //метод будет возвращать новый fetch
        return fetch(url ? url : `${List.API + this.url}`)//запись обозначает: "url?" - если передан url  - импользуй его, если нет - API+url из конструктора
            .then(result => result.json())//полученный result от fetch обрабатываем через json и получаем promice (далее обрабатываем объект промис)

    }

    handleData(data) {//обработчик массива товаров, который создает элементы товаров и рендерит их на страницы (для каталога - массив товаров, для корзины - массив counted из репозитория)
        for (let item of data) {//для каждого элемента массива создаем новый элемент товара и добаляем в массив products
            this.products.push(new List.itemsMap[this.constructor.name](item));
        }
        this._render();
    }

    getItem(id){ //поиск товара по id
        return this.products.find(el => el.id_product === id);
    }

    calcSum() {
        return this.products.reduce((accum, item) => accum += item.price, 0);
    }
    //accum - последний результат вызова ф-ии, он же промежуточный результат
    //item - текущий жлемент массива, элементы перебираются по очереди слева направо

    _init(){} // вызов инициализации (будем определять в каждом классе наследнике)

    _render() {
        for (let product of this.products) {
            if (product.rendered) {
                continue;
            }

            this.container.insertAdjacentHTML('beforeend', product.render())
        }
    }
}


class Products extends List{ // класс каталог
    cart = null; // ссылка на корзину (начала создается корзина потом передается в каталог)

    constructor(cart, container = '.products', url = "/catalogData.json") {
        super(container, url);
        this.cart = cart;
        this.getJson()//получепние данных каталога
            .then(data => this.handleData(data))
    }

    _init() {
        this.container.addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                const id = +e.target.dataset['id'];
                this.cart.addProduct(this.getItem(id))
            }
        })
    }
}

class Cart extends List{ //класс корзина
    constructor(container = '.cart-block', url = '/getBasket.json') {
        super(container, url);
        this.getJson()
            .then(data => this.handleData(data.contents));
    }
    addProduct(product){//создает новый экземляр CartItem и добавляет в массив
        this.getJson(`${List.API}/addToBasket.json`)//имитация запроса к серверу на ДОБАВЛЕНИЕ товара в корзину
            .then(data => {
                if(data.result){ //при положительном результате (товар в наличии) создаем новый instans и добавить в корзину
                    let find = this.products.find(el => el.id_product === product.id_product);
                    if (find) {
                        find.changeQuantity(1);
                        return
                    }

                    let prod = Object.assign({quantity: 1}, product)//если не нашли, создаем новый объект с данными (первый объект assign - целевой объект, второй - тот из которого копируем все св-ва и название) Целевому объекту при создании сразу присваиваем количество = 1
                    this.handleData([prod]);
                }else {
                    console.log('some error');
                }
            })
    }

    removeProduct(product) { //удаление товара из корзины
        this.getJson(`${List.API}/deleteFromBasket.json`)//имитация запроса к серверу на УДАЛЕНИЕ товара в корзину
            .then(data => {
                if(data.result){
                    if (product.quantity > 1) {  // узнаем в каком количестве товар в корзине, больше единицы?
                        product.changeQuantity(-1); //если true, вычитаем единицу
                        return
                    }

                    this.products.splice(this.products.indexOf(product), 1) //splice позволяет удалить элемент(ы) начиная с опеределнного индекса
                    product.removeMarkup(); //удаление разметки товара (если товар был в кол-ве 1 шт)
                }else {
                    console.log('some error');
                }
            })
    }
    _init() {
        this.container.addEventListener('click', e => {
            if (e.target.classList.contains('del-btn')) {
                const id = +e.target.dataset['id']; //id приводим к числу с помощью +
                this.removeProduct(this.getItem(id))
            }
        });
        document.querySelector('.btn-cart').addEventListener('click', () => {
           this.container.classList.toggle('invisible');
        });

    }

}

const cart = new Cart();
const list = new Products(cart);
list.getJson(`getProducts.json`).then(data => list.handleData(data));



let form = document.querySelector('form');

const option1 = new RegExp('[a-zA-Zа-яА-ЯёЁ]', 'gi');
const option2 = new RegExp(/.\d{3}.\d{3}.\d{4}/, 'gi');
const option3 = new RegExp(/[a-z]{1,30}[.-]?mail@mail.ru/, 'gi');

form.onsubmit = function (ev) {
    ev.preventDefault()

    name = document.getElementById('param1').value;
    phone = document.getElementById('param2').value;
    mail = document.getElementById('param3').value;

    if (!option1.test(name)) {
        document.getElementById('param1').classList.add('err')
        alert('Имя должно содержать только буквы');
    }
    if (!option2.test(phone)) {
        document.getElementById('param2').classList.add('err')
        alert('Телефон должен иметь вид +7(000)000-0000.');
    }
    if (!option3.test(mail)) {
        document.getElementById('param3').classList.add('err')
        alert(' E-mail должен иметь вид: mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru');
    }

}
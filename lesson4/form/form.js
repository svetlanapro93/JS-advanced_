class Form {

    constructor() {
        this.render();
        this.formValidation();
    }

    render() {
        this.formText = `
         <div class="container">
            <form action="">
                <h3>Форма обратной связи</h3>
                <div class="form__wrapper">
                    <p>Имя</p>
                    <input type="text" placeholder="Имя" name="name" id="param1">
                    <p>Телефон</p>
                    <input type="text" placeholder="+7(000)000-0000" name="phone" id="param2">
                    <p>E-mail</p>
                    <input type="text" placeholder="mymail@mail.ru" name="mail" id="param3">
                    <p>Вопрос / Комментарий</p>
                    <textarea name="text" cols="30" rows="10" placeholder="Сообщение" id="param4"></textarea>
                    <input class="sub" type="submit" value="Отправить">
                </div>
            </form>
        </div>
        `
        document.querySelector('main').insertAdjacentHTML('afterbegin', this.formText);
    }

    formValidation() {
        document.querySelector('form').addEventListener('submit', ev => {
            // let option1 = new RegExp(/[a-zA-Zа-яА-ЯёЁ]+/, 'i');
            // let option2 = new RegExp(/.\d{3}.\d{3}.\d{4}/, 'i');
            // let option3 = new RegExp(/[a-z]{1,30}[.-]?mail@mail.ru/, 'i');

            this.name = document.getElementById('param1').value;
            this.phone = document.getElementById('param2').value;
            this.mail = document.getElementById('param3').value;

            if (!/a-zA-ZА-Яа-яЁё ]+/i.test(this.name)) {
                ev.preventDefault();
                document.getElementById('param1').classList.add('err')
                alert('Имя должно содержать только буквы');
            } else {
                document.getElementById('param1').classList.remove('err');
            }
            if (!/\+7\(\d{3}\)\d{3}-\d{4}/i.test(this.phone)) {
                ev.preventDefault();
                document.getElementById('param2').classList.add('err');
                alert('Телефон должен иметь вид +7(000)000-0000.');
            } else {
                document.getElementById('param2').classList.remove('err')
            }
            if (!/^[a-z]+[-.]?[a-z]+@[a-z]+\.[a-z]+/i.test(this.mail)) {
                ev.preventDefault();
                document.getElementById('param3').classList.add('err')
                alert(' E-mail должен иметь вид: mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru');
            } else {
                document.getElementById('param3').classList.remove('err')
            }

        })
    }
}

let form1 = new Form();

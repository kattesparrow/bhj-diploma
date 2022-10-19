//const { application } = require("express");

/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage  {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  
  constructor( element ) {
    if (!element) {
			throw new Error('Элемент не задан');
		} else {
		this.element = element;
		this.registerEvents();
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
      this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */

  registerEvents() {
    const removeAccountButton = this.element.querySelector(".remove-account");

		removeAccountButton.addEventListener("click", () => {
			this.removeAccount();
		});

		this.element.addEventListener("click", event => {
			if (event.target.closest(".transaction__remove")) {
				let id = event.target.closest(".transaction__remove").dataset.id;
				this.removeTransaction(id);
			}
		});
  }

  /**  
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */

  removeAccount() {
    if (!this.lastOptions) {
			return
		}
		if (!confirm("Вы действительно хотите удалить счет?")) {
			return
		}
    const accData = {id : this.lastOptions.account_id};

		Account.remove(accData, (err, response) => {
			if (response && response.success) {
				App.widgets.accounts.update();
			} else {
        throw new Error('Что-то пошло не так!');
      }
		});
    this.clear();
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */

  removeTransaction( id ) {
    if(confirm('Вы действительно хотите удалить транзакцию?')) {
        Transaction.remove({id: id},(err,resp) => {
            if(resp && resp.success) {
                App.update();
            }
         })
      };
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */

   render(options){
    if (!options) {
			return;
		}
		if (!options.account_id) {
			return;
		}
		this.lastOptions = options;

		Account.get(options.account_id, (err, resp) => {
			if (resp) {
				this.renderTitle(resp.data.name);
			}
		});

		Transaction.list(options, (err, resp) => {
			if (resp) {
				this.renderTransactions(resp.data);
			}
		});
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
   clear() {
    this.renderTransactions([]);
		this.renderTitle('Название счета');
    // document.querySelector('.content-title').textContent = 'Название счета';
		this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    // document.querySelector('.content-title').textContent = name;
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
      const monthString = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
      let dateN = new Date(date);
    
      let stringDateTransaction;
      return stringDateTransaction = `${dateN.getDate()} ${monthString[dateN.getMonth()]}  ${dateN.getFullYear()} г. в ${dateN.toISOString().slice(11,16)}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
      if(item) {
          let codTransaction;
          let s =  document.querySelector(item.type);
   
          if(item.type == 'income') {
              codTransaction = 'transaction_income';
          }
    
          if(item.type == 'expense') {
              codTransaction = 'transaction_expense';
          }

      return `<div class="transaction ${codTransaction} row" style="display: flex;justify-content: space-between">
                <div class="col-md-7 transaction__details">
                    <div class="transaction__icon">
                        <span class="fa fa-money fa-2x"></span>
                    </div>
                
                    <div class="transaction__info">
                        <h4 class="transaction__title">${item.name}</h4>
                        <!-- дата -->
                        <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="transaction__summ">
                    <!--  сумма -->
                    ${item.sum} <strike>P</strike>    
                    </div>
                </div>

                <div class="col-md-2 transaction__controls">
                    <!-- в data-id нужно поместить id -->
                    <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                      <i class="fa fa-trash"></i>  
                    </button>
                </div>
            </div>`    
    }
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
      if(data) {
          const addListTransactions = document.querySelector('.content');
          
          document.querySelectorAll('.transaction').forEach(elem => elem.remove());
          data.forEach((elem) => {
              addListTransactions.insertAdjacentHTML('beforeend', this.getTransactionHTML(elem));
          })
      }
  }
}
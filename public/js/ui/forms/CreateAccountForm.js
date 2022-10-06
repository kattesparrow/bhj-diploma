/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  
  onSubmit(data) {
    this.element.update;
    Account.create(data, (err, response) => {
      if (response) {
        this.element.reset();
        App.update();
        App.getModal('createAccount').close();
      }
    });
  }
}

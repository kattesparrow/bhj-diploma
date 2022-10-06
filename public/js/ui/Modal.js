/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */

  constructor(element){
    this.element = element;
    this.registerEvents();

   if(element === undefined) {
      const errorGetElement = new Error('Элемент не существует');
      throw errorGetElement;
   }
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */

  registerEvents() {
   this.element.querySelectorAll('[data-dismiss="modal"]').forEach(element => {
      element.onclick = event => {
      this.onClose(event);
      }
    });
    
    }
  

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */

  onClose(e) {
    e.preventDefault();
    this.close();
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */

  open() {
    this.element.style.display = 'block';           
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  
  close(){
    this.element.style.display = 'none';  
    
  }
}
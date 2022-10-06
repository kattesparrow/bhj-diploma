/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */

  static initToggleButton() {
    const sidebarPanelVisible = document.querySelector('.sidebar-mini');
    const sidebarToggle = document.querySelectorAll('.visible-xs');

    document.addEventListener('click', event => {
      
      if(event.target.className.includes('visible-xs')) {
        if(sidebarPanelVisible.className.includes('sidebar-open')) {
            sidebarPanelVisible.classList.remove('sidebar-open')
            sidebarPanelVisible.classList.remove('sidebar-collapse')
        }else {
            sidebarPanelVisible.classList.add('sidebar-open');
            sidebarPanelVisible.classList.remove('sidebar-collapse')

        }
      }
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  
  static initAuthLinks() {
      const menuSideBar = document.querySelectorAll('.sidebar-menu');
      menuSideBar.forEach(elment => {
        elment.addEventListener('click', event => {
          if(event.target.parentElement.parentElement.className.includes('menu-item_login')) {
              event.preventDefault();
              App.getModal('login').open();
          };
          if(event.target.parentElement.parentElement.className.includes('menu-item_register')) {
                event.preventDefault();
                App.getModal('register').open();
            }; 
          if(event.target.parentElement.parentElement.className.includes('menu-item_logout')) {
                      event.preventDefault();
                      User.logout((err,resp) => {
                          if(resp && resp.success) {
                              App.setState('init');
                          }
                      });
          };
              
            
        })
      })
    }
  }
  

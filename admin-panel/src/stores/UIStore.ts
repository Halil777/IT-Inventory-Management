import { makeAutoObservable } from 'mobx';

class UIStore {
  sidebarCollapsed = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

export default new UIStore();

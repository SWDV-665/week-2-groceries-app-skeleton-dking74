import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { AddGroceryItemModal } from './modal/modal.component';
import Grocery from '@models/grocery';

@Component({
  selector: 'grocery-tab',
  templateUrl: 'grocery.page.html',
  styleUrls: ['grocery.page.scss']
})
export class GroceryPage {
  newGroceryItemField: Boolean = false;
  groceries: Array<Grocery> = [];

  constructor(private modalController: ModalController) {
    if (!sessionStorage.getItem('groceries')) {
      this.groceries = [
        new Grocery('Milk', 5, 3.50),
        new Grocery('Soap', 3, .50),
        new Grocery('Toilet Paper', 8, 5.30),
        new Grocery('Chicken', 2, 7.85),
        new Grocery('Frosted Flakes', 1, 4.10),
        new Grocery('Apple', 12, .35)
      ];
      this.saveGroceriesToSessionStorage();
    } else {
      this.groceries = JSON.parse(sessionStorage.getItem('groceries'));
    }
  }

  async addGroceryItem() {
    this.newGroceryItemField = true;

    const modal = await this.modalController.create({
      component: AddGroceryItemModal,
      cssClass: 'add-grocery-modal',
      componentProps: {
        currentGroceries: this.groceries
      }
    });

    this.addGroceryItemFromModal(modal);

    return await modal.present();
  }

  deleteGroceryItem(groceryItem: Grocery) {
    this.groceries = this.groceries.filter(item => item.name != groceryItem.name);
    this.saveGroceriesToSessionStorage();
  }

  addQuantityToGroceryItem(grocery: Grocery) {
    this.groceries
      .filter(groceryItem => groceryItem.name === grocery.name)
      .map(item => item.quantity++);
    this.saveGroceriesToSessionStorage();
  }

  dropQuantityToGroceryItem(grocery: Grocery) {
    this.groceries
      .filter(groceryItem => groceryItem.name === grocery.name)
      .map(item => item.quantity > 0 && item.quantity--);
    this.saveGroceriesToSessionStorage();
  }

  addGroceryItemFromModal(modal: HTMLIonModalElement) {
    modal.onDidDismiss()
      .then((groceryItem) => {
        if (
            groceryItem.data && this.groceries.filter(
              grocery => grocery.name === groceryItem.data.name
            ).length === 0
        ) {
          this.groceries.push(groceryItem.data);
        }
      });
    this.saveGroceriesToSessionStorage();
  }

  saveGroceriesToSessionStorage() {
    sessionStorage.setItem('groceries', JSON.stringify(this.groceries));
  }
}

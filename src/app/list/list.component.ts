import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
export interface PeriodicElement {
  Name: string;
  Price: string;
  Quantity: number;
  Size: string;
  description: string;
  imageUrl: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    Price: '100₹/Item',
    Name: 'Crispy Chicken Pizza',
    Quantity: 15,
    Size: 'Small, Medium, Large',
    description: `This fried and Crispy Bread Pizza Pattice with beautiful golden brown crust and hot creamy chicken filling. Delicious and yummy treat for one and all.`,
    imageUrl: '../../assets/crispyChicken.jpeg',
  },
  {
    Price: '125₹/Item',
    Name: 'Pastrami Pizza',
    Quantity: 45,
    Size: 'Small, Medium, Large',
    description: `This hot pastrami pizza is the combination of melty cheese, delicious dressing, and salty meat, recipe delivers on the flavor, yet it is surprisingly healthy. Try it – I don't think you'll be disappointed.`,
    imageUrl: '../../assets/Pastrami.jpeg',
  },
  {
    Price: '120₹/Item',
    Name: 'Pine Apple Shrimp Pizza',
    Quantity: 5,
    Size: 'Small, Medium',
    description: `The sweetness of pineapple combines with the saltiness of the ham, cheese, and tomato sauce, it's a match made in heaven.`,
    imageUrl: '../../assets/PineAppleShrimp.jpeg',
  },
  {
    Price: '350₹/Item',
    Name: 'Meat Lover Pizza',
    Quantity: 35,
    Size: 'Small, Medium, Large',
    description: `Thin crust pizza, topped off with two types of cheese, bacon, ham, pepperoni and hot sausage! A must make for meat lover's.`,
    imageUrl: '../../assets/MeatLover.jpeg',
  },
  {
    Price: '180₹/Item',
    Name: 'Fruit Deluxe Pizza',
    Quantity: 10,
    Size: 'Small, Medium, Large',
    description: `A delicious fruit pizza with a cookie dough crust, cream cheese filling, and fruit topping, a perfect summer treat!`,
    imageUrl: '../../assets/FruitDeluxe.jpeg',
  },
  {
    Price: '120₹/Item',
    Name: 'Hawalian Style Pizza',
    Quantity: 20,
    Size: 'Medium, Large',
    description: `Hawaiian Pizza combines pizza sauce, cheese, cooked ham, pineapple pizza crust and is finished with a sprinkle of crispy bacon. It's salty, sweet, cheesy, and undeniably delicious! Hawaiian pizza is the most underrated pizza on the planet.`,
    imageUrl: '../../assets/HawalianStyle.jpeg',
  },
  {
    Price: '300₹/Item',
    Name: 'Tuna Delight Pizza',
    Quantity: 30,
    Size: 'Small, Medium, Large',
    description: `Combination of Hot & Spicy Tuna, Mayonnaise, Onion, Red Pepper, Parsley and Mozzarella. Tuna is still an excellent source of protein, and low in the saturated fats found in meat, so it certainly wouldn't knock it in terms of a healthy pizza topping.`,
    imageUrl: '../../assets/TunaDelight.jpeg',
  },
  {
    Price: '150₹/Item',
    Name: 'Cheese Lover pizza',
    Quantity: 50,
    Size: 'Small, Medium, Large',
    description: `This new recipe is a mouth-watering combination of Alfredo sauce and three cheeses – Romano, Parmesan, and Pizza Hut's signature pizza cheese– blended to create an ultimate cheese experience like no other. A pizza with this much ooey, gooey cheese had to be called the Ultimate Cheese Lover's.`,
    imageUrl: '../../assets/CheeseLover.jpeg',
  },
  {
    Price: '120₹/Item',
    Name: 'Pepperoni Pizza',
    Quantity: 25,
    Size: 'Medium',
    description: `Pepperoni offers a slightly spicy, meaty flavor to the dough, sauce, cheese combination. The spice often balances the sweetness in the tomato sauce. Also, it complements the fat in the cheese. Combined, the bite is completely satisfying.`,
    imageUrl: '../../assets/Pepperoni.jpeg',
  },
  {
    Price: '100₹/Item',
    Name: 'Veggies Delux Pizza',
    Quantity: 25,
    Size: 'Small, Medium, Large',
    description: `This Veggie Deluxe Pizza is topped with stretchy mozzarella and a medley of crisp veggies that bring on a ton of flavor. For a vegetarian looking for a BIG treat that goes easy on the spices, this one's got it all..`,
    imageUrl: '../../assets/VeggiesDelux.jpeg',
  },
];
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListComponent implements OnInit {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['Name', 'Quantity', 'Size', 'Price'];
  sauces = ['Tomato Sauce', 'BBQ Sauce', 'Creme Fraiche'];
  meat = [
    'Chicken',
    'Chorizo',
    'Ham/Bacon',
    'Prawns',
    'Salami',
    'Beef Strips',
    'Pepperoni',
    'Sausage',
  ];
  vegetables = [
    'Tomatoes',
    'Baby Spinach',
    'Olives',
    'Capsicum',
    'Red Onion',
    'Avacado',
    'Mushrooms',
    'Pine Apple',
    'Sliced Zucchini',
    'Broccoli',
  ];
  cheeses = ['Mozzerella', 'Brie', 'Feta', 'Chives'];
  seasoning = [
    'Garlic',
    'Basil',
    'Oregano',
    'Parsley',
    'Chilli Flakes',
    'Chives',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]> | undefined;
  fruits: string[] = [];
  allFruits: string[] = [];
  size: string = '';
  quantity: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement> | undefined;

  constructor(
    private _snackBar: MatSnackBar,
    public router: Router,
    public authService: AuthService
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allFruits.slice()
      )
    );
  }

  ngOnInit(): void {}
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    if (this.fruitInput != undefined) {
      this.fruitInput.nativeElement.value = '';
    }
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }
  onSelect(event: any) {
    if (event.value) {
      this.fruits = [];
      this.allFruits = [];
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) =>
          fruit ? this._filter(fruit) : this.allFruits.slice()
        )
      );
      switch (event.value) {
        case 'meat':
          this.allFruits = this.meat;
          break;
        case 'sauces':
          this.allFruits = this.sauces;
          break;
        case 'vegetables':
          this.allFruits = this.vegetables;
          break;
        case 'cheeses':
          this.allFruits = this.cheeses;
          break;
        case 'seasoning':
          this.allFruits = this.seasoning;
          break;
      }
    }
  }
  onChangeQuantity(event: any) {
    this.quantity = event.target.value;
  }
  expandRow() {
    this.allFruits = [];
    this.fruits = [];
    this.quantity = '';
    this.size = '';
  }
  getSizes(sizes: any) {
    if (sizes) {
      return sizes.split(',');
    } else {
      return [];
    }
  }
  onSelectSize(event: any) {
    this.size = event.value;
  }
  placeOrder(element: any) {
    if (!this.quantity) {
      this.openSnackBar('Please Select Quantity');
    } else if (this.quantity > element.Quantity) {
      this.openSnackBar('Available Quantity is' + element.Quantity);
    } else if (!this.size) {
      this.openSnackBar('Please Select Size');
    } else {
      let orderItem = {
        OrderId: Math.floor(Math.random() * 1000),
        Name: element.Name,
        Quantity: this.quantity,
        Size: this.size,
        Toppings: this.fruits.join(),
        TotalPrice: Number(this.quantity) * Number(element.Price.split('₹')[0]),
        OrderedDate: new Date(),
      };
      this.authService.saveOrder(orderItem);
      this.openSnackBar(
        'Order Placed Successfully',
        'OrderId:' +
          orderItem.OrderId +
          ' ,Total Price:' +
          orderItem.TotalPrice +
          '₹'
      );
      this.router.navigate(['orders']);
    }
  }
  logout() {
    this.authService.logout();
  }
  openSnackBar(msg1: any, msg2?: any) {
    this._snackBar.open(msg1, msg2, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5 * 1000,
    });
  }
}

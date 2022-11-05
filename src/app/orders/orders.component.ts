import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {Observable, ReplaySubject} from 'rxjs';
import {DataSource} from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
export interface PeriodicElement {
  OrderId: string;
  Name: string;
  Quantity: string;
  Size: string;
  Toppings: string;
  TotalPrice: string;
  OrderedDate: string;
  Action: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns: string[] = ['OrderId', 'Name', 'Quantity', 'Size', 'Toppings', 'TotalPrice', 'OrderedDate', 'Action'];
  dataSource = new ExampleDataSource(this.authService.getOrdersList());
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(public router:Router, public authService: AuthService, private _snackBar: MatSnackBar,) { 
  }

  ngOnInit() {

  }
  onRemove(index:any) {
     this.authService.ordersList.splice(index,1);
     this.dataSource.setData(this.authService.ordersList);
      this._snackBar.open(
        'Order Deleted Successfully!', '',
        {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 2 * 1000,
        }
      );
  }
  back() {
   this.router.navigate(['list']);
  }

}
class ExampleDataSource extends DataSource<PeriodicElement> {
  private _dataStream = new ReplaySubject<PeriodicElement[]>();

  constructor(initialData: PeriodicElement[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<PeriodicElement[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PeriodicElement[]) {
    this._dataStream.next(data);
  }
}

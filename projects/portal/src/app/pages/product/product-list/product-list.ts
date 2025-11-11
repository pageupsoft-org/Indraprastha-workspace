import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductUpsert } from '../product-upsert/product-upsert';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  public readonly dialog = inject(MatDialog);

  // Open PopUp
  public openModel(id: number = 0) {
    const dialogRef = this.dialog.open(ProductUpsert, {
      width: '80%',
      maxWidth: '900px',
      height: '90%',
      data: {
        id: id
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
      }
    });
  }

  // Product List
  
  
}

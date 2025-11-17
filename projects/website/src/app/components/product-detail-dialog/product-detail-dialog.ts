import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [
    CommonModule,
    MatDialogModule
],
  templateUrl: './product-detail-dialog.html',
  styleUrl: './product-detail-dialog.scss',
})
export class ProductDetailDialog {
  constructor(
    private dialogRef: MatDialogRef<ProductDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  blouseOptions = ['Blouse Piece', 'Styled/Stitched Blouse'];
  tailors = ['Tailor Name', 'Tailor 1', 'Tailor 2'];

  selectedSize: string | null = null;
  selectedBlouse: string | null = null;

  close() {
    // this.isOpen = false;
    // this.closeModal.emit();
    this.dialogRef.close()
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IProduct } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.scss']
})
export class DeleteProductModalComponent implements OnInit {
  @Input() product: IProduct;
  @Output() cancel = new EventEmitter();
  @Output() confirm = new EventEmitter();
  constructor() { }

  public cancelDelete(): void {
    this.cancel.emit();
  }

  public confirmDelete(): void {
    this.confirm.emit();
  }

  ngOnInit(): void {
  }

}

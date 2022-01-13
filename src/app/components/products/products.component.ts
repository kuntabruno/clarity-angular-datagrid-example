import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { IProduct, ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {
  public deleting: boolean = false;
  public productToBeDeleted: IProduct;
  public products$: Observable<IProduct[]> = new BehaviorSubject<IProduct[]>([]);
  public productOpen: boolean;
  public selectedProduct: IProduct;
  constructor(
    private productSvc: ProductService
  ) { }

  public trackById(index: number, item: IProduct): number {
    return item.id;
  }

  public addProduct(): void {
    this.productOpen = true;
    this.selectedProduct = undefined;
  }

  public onEdit(product: IProduct): void {
    this.productOpen = true;
    this.selectedProduct = product;
  }

  public handleFinish(event?: { product: IProduct }): void {
    if (event && event.product) {
    if (this.selectedProduct) {
      const id = this.selectedProduct.id;
      this.productSvc.editProduct(id, event.product);
    } else {
      this.productSvc.addProduct(event.product);
    }
   }
    this.productOpen = false;
  }

  public onDelete(product: IProduct): void {
    this.deleting = true;
    this.productToBeDeleted = product;
  }

  public confirmDelete(): void {
    this.handleCancel();
    this.productSvc.removeProduct(this.productToBeDeleted);
  }

  public handleCancel(): void {
     this.deleting = false;
  }

  ngOnInit(): void {
    this.products$ = this.productSvc.products$;
  }

}

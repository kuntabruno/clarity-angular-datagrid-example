import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClrWizard } from '@clr/angular';

import { pick } from 'lodash-es';

import { IProduct } from 'src/app/services/product/product.service';
import { minDateValidation } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  @Input() product: IProduct;
  @Output() finish = new EventEmitter();
  @ViewChild('productWizard', { static: false }) productWizard: ClrWizard;
  public productForm: FormGroup;
  public deviceType = 'tablet';
  public deviceTypes = [
    {
      name: 'Tablet',
      icon: 'tablet',
    }, {
      name: 'Laptop',
      icon: 'computer'
    }, {
      name: 'Phone',
      icon: 'mobile'
    }, {
      name: 'Monitor',
      icon: 'display'
    }
  ];
  constructor(
    private fb: FormBuilder,
  ) {
    this.productForm = this.createFormGroup(this.fb);
  }

  private createFormGroup(fb: FormBuilder): FormGroup {
    return new FormGroup({
      basic: fb.group({
        name: new FormControl('', [ Validators.required ]),
        description: '',
        active: false,
        features: fb.array([
          this.createFormControl()
        ])
      }),
      expiration: fb.group({
        expirationDate: [
          null,
          Validators.compose([
             Validators.required,
             minDateValidation(new Date())
          ])
       ],
      })
    });
  }

  get isBasicInvalid(): boolean {
    return this.productForm.get('basic').invalid;
  }

  get isExpirationInvalid(): boolean {
    return this.productForm.get('expiration').invalid;
  }

  createFormControl(): FormControl {
    return new FormControl('');
  }

   /* Get Formgroup Controls */
  get f(): {
    [key: string]: AbstractControl;
    } {
     return this.productForm.controls;
  }

  getFormFieldErrors(form: string, element: string): string {
    const control: AbstractControl = this.productForm.get(form);
    return control.hasError('required')
      ? `${element} is Required`
      : control.hasError('minDateValidation')
      ? `Expiration should be after today's date`
      : 'Invalid';
   }

   getExpirationFormFieldErrors(form: string, element: string): string {
    const control: AbstractControl = this.productForm.get(form);
    return control.hasError('required')
      ? `${element} is Required`
      : control.hasError('minDateValidation')
      ? `Expiration should be after today's date`
      : 'Invalid';
   }

  selectDevice(device: any) {
    this.deviceType = device.icon;
  }

  handleClose() {
    this.finish.emit();
    this.close();
  }

  close() {
    this.productForm.reset();
    this.deviceType = 'tablet';
    this.productWizard.goTo(this.productWizard.pageCollection.pages.first.id);
    this.productWizard.reset();
  }

  get basicFeatures(): FormArray {
    return this.productForm.get('basic.features') as FormArray;
  }

  addFeature() {
    this.basicFeatures.push(this.fb.control(''));
  }

  public handleFinish() {
    this.finish.emit({
      type: this.deviceType,
      ...this.productForm.get('basic').value,
      ...this.productForm.get('expiration').value
    })
  }

  ngOnInit(): void {
    if (this.product) {
      this.productForm.setValue({
        basic: {
          ...pick(this.product, ['name', 'description', 'active']),
          features: this.product.features || [''],
        },
        expiration: {
          ...pick(this.product, ['expirationDate']),
        }
      });
      this.deviceType = this.product.type;
    }

  }

}

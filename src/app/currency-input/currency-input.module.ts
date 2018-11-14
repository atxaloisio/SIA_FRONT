import { CurrencyInputComponent } from './currency-input.component';
import { UpperCaseModule } from '../uppercase/uppercase.module';
import { MatNativeDateModule } from '@angular/material';
import { MyMaterialModule } from '../my-material/my-material.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomCurrencyMaskConfig } from '../customcurrencymaskconfig';
import { CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepipeModule } from '../datepipe/datepipe.module';
import { FocusModule } from '../focus/focus.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MyMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    UpperCaseModule,
    CurrencyMaskModule,
    DatepipeModule,
    FocusModule
  ],
  declarations: [
    CurrencyInputComponent
  ],
  exports: [ CurrencyInputComponent],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  entryComponents: [CurrencyInputComponent],
})
export class  CurrencyInputModule { }

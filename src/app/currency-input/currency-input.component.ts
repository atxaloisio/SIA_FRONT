import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  HostBinding,
  HostListener,
  Optional,
  Self,
  Inject,
  NgZone,
  OnChanges,
  OnInit,
  DoCheck
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NgControl,
  NgForm,
  FormGroupDirective
} from '@angular/forms';
import {
  MatFormFieldControl,
  ErrorStateMatcher,
  MAT_INPUT_VALUE_ACCESSOR,
  _MatInputMixinBase,
  CanUpdateErrorState,
  getMatInputUnsupportedTypeError
} from '@angular/material';
import { Subject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';

@Component({
  selector: 'currency-input',
  templateUrl: 'currency-input.component.html',
  styleUrls: ['currency-input.component.css'],
  providers: [{ provide: MatFormFieldControl, useExisting: CurrencyInputComponent }],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
  //   '[class.example-floating]': 'shouldLabelFloat',
  //   '[class.mat-input-server]': '_isServer',
  //   '[id]': 'id',
  //   '[attr.placeholder]': 'placeholder',
    '[disabled]': 'disabled',
  //   '[required]': 'required',
  //   '[attr.readonly]': 'readonly && !_isNativeSelect || null',
  //   '[attr.aria-describedby]': '_ariaDescribedby || null',
  //   '[attr.aria-invalid]': 'errorState',
  //   '[attr.aria-required]': 'required.toString()',
  //   '(blur)': '_focusChanged(false)',
  //   '(focus)': '_focusChanged(true)',
  //   '(input)': '_onInput()',
  }
})

export class CurrencyInputComponent extends _MatInputMixinBase
  implements
    MatFormFieldControl<any>,
    OnChanges,
    OnDestroy,
    OnInit,
    DoCheck,
    CanUpdateErrorState {
  static nextId = 0;

  focused = false;
  errorState = false;
  controlType = 'currency-input';
  _uid = `currency-input-${CurrencyInputComponent.nextId++}`;
  protected _previousNativeValue: any;
  private _inputValueAccessor: { value: any };
  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  /** Whether the component is being rendered on the server. */
  _isServer = false;

  /** Whether the component is a native html select. */
  _isNativeSelect = false;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  readonly stateChanges: Subject<void> = new Subject<void>();

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  autofilled = false;

  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  private _disabled = false;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return !this._elementRef.nativeElement.value;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id: string;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  /** Input type of the element. */
  @Input()
  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value || 'text';
  }
  protected _type = 'text';

  /** An object used to control when error messages are shown. */
  @Input()
  errorStateMatcher: ErrorStateMatcher;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): string {
    return this._inputValueAccessor.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;

  @HostBinding('class.example-floating')
  ef = this.shouldLabelFloat;
  @HostBinding('class.mat-input-server')
  mis = this._isServer;
  @HostBinding('id')
  hid = this.id;
  @HostBinding('attr.placeholder')
  ap = this._placeholder;
  @HostBinding('disabled')
  dis = this._disabled;
  @HostBinding('required')
  req = this._required;
  @HostBinding('attr.readonly')
  areadonly = (this.readonly && this._isNativeSelect) || null;
  @HostBinding('attr.aria-describedby')
  ad = this._ariaDescribedby || null;
  @HostBinding('attr.aria-invalid')
  ai = this.errorState;
  @HostBinding('attr.aria-required')
  ar = this._required.toString();
  @HostListener('blur')
  onblur() {
    this._focusChanged(false);
  }
  @HostListener('focus')
  onfocus() {
    return this._focusChanged(true);
  }
  @HostListener('input')
  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }

  constructor(
    protected _elementRef: ElementRef<HTMLInputElement>,
    protected _platform: Platform,
    /** @docs-private */
    @Optional()
    @Self()
    public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional()
    @Self()
    @Inject(MAT_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: any,
    private _autofillMonitor: AutofillMonitor,
    ngZone: NgZone,
    private fm: FocusMonitor
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    const element = this._elementRef.nativeElement;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    this._inputValueAccessor = inputValueAccessor || element;

    this._previousNativeValue = this.value;

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    fm.monitor(_elementRef, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
    this._isServer = !this._platform.isBrowser;
  }

  ngOnInit() {}

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this._elementRef);
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();
  }

  // setDescribedByIds(ids: string[]) {
  //   this.describedBy = ids.join(' ');
  // }

  // onContainerClick(event: MouseEvent) {
  //   if ((event.target as Element).tagName.toLowerCase() != 'input') {
  //     this._elementRef.nativeElement.querySelector('input')!.focus();
  //   }
  // }

  /** Focuses the input. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && !this.readonly) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /** Does some manual dirty checking on the native input `value` property. */
  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/material2/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */

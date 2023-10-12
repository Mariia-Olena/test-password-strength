import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  message = '';

  form = new FormGroup({
    input: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^[a-zA-Z0-9/!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]+$/),
      this.passwordStrengthValidator(),
    ]),
  });

  get input(): FormControl {
    return this.form.controls.input;
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasLetters = /[A-Za-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

      const passwordValid = hasLetters && hasNumbers && hasSymbols;

      return !passwordValid ? { hasLetters, hasNumbers, hasSymbols } : null;
    };
  }

  checkPasswordCombination(number: number): boolean {
    if (this.form.controls.input.errors) {
      const { hasLetters, hasNumbers, hasSymbols } =
        this.form.controls.input.errors;

      const arr = [hasLetters, hasNumbers, hasSymbols].filter(
        (item) => item === true
      );

      return arr.length === number ? true : false;
    }

    return false;
  }

  passwordMinlengthError() {
    return this.input.errors?.['minlength'];
  }

  passwordPatternError() {
    return this.input.errors?.['pattern'];
  }

  isPasswordEasy(): boolean {
    return this.checkPasswordCombination(1);
  }

  isPasswordMedium(): boolean {
    return this.checkPasswordCombination(2);
  }

  isPasswordStrong(): boolean {
    return this.form.controls.input.errors === null;
  }

  checkPasswordStrength(): string {
    if (this.passwordPatternError()) {
      this.message = 'Cyrillic letters and spaces are not allowed';
      return 'invalid';
    }

    if (this.passwordMinlengthError()) {
      this.message = 'Password should be at least 8 characters long';
      return 'invalid';
    }

    if (this.isPasswordStrong()) {
      this.message = 'Password is strong';
      return 'strong';
    }

    if (this.isPasswordMedium()) {
      this.message = 'Password is medium';
      return 'medium';
    }

    if (this.isPasswordEasy()) {
      this.message = 'Password is easy';
      return 'easy';
    }

    return '';
  }
}

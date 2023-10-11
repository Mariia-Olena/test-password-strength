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
  form = new FormGroup({
    input: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator(),
    ]),
  });

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

  checkCombination(number: number): boolean {
    if (this.form.controls.input.errors) {
      const { hasLetters, hasNumbers, hasSymbols } =
        this.form.controls.input.errors;

      const arr = [hasLetters, hasNumbers, hasSymbols].filter(
        (item) => item === true,
      );

      return arr.length === number ? true : false;
    }

    return false;
  }

  minLength(): boolean {
    return this.form.controls.input.errors?.['minlength'];
  }

  easy(): boolean {
    return this.checkCombination(1);
  }

  medium(): boolean {
    return this.checkCombination(2);
  }

  strong(): boolean {
    return this.form.controls.input.errors === null;
  }
}

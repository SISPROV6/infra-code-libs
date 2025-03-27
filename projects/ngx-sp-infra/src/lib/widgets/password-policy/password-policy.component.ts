import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { PasswordRequirementsRecord } from './models/passwordRequirementsRecord';
import { CheckPasswordRecord } from './models/checkPasswordRecord';
import { NgClass, NgIf } from '@angular/common';
import { LibIconsComponent } from '../lib-icons/lib-icons.component';

@Component({
    selector: 'lib-password-policy',
    templateUrl: './password-policy.component.html',
    styles: `
    .requirements {
      list-style: none;
      color: #842029;
      font-size: 13px;
      padding-left: 0rem;
      margin-left: -0.5%;
    }

    .PasswordValid { color: #0F5132; }

    .title {
      color: #212529;
      font-size: 15px;
    }
  `,
    standalone: true,
    imports: [NgClass, NgIf, LibIconsComponent]
})
export class PasswordPolicyComponent implements OnChanges {

  @Input() title: string = "";
  @Input({ required: true }) passwordRequirements!: PasswordRequirementsRecord;
  @Input({ required: true }) checkPassword!: CheckPasswordRecord;

  @Output() isPasswordValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  public QtnMinima: boolean = false
  public HasNumero: boolean = false
  public HasCaractereEspecial: boolean = false
  public HasLetraMaiuscula: boolean = false

  public ngOnChanges() {
    this.QtnMinima = !!this.checkPassword.Quantidade;
    this.HasCaractereEspecial = !!this.checkPassword.HasCaracteresEspeciais;
    this.HasNumero = !!this.checkPassword.HasNumeros;
    this.HasLetraMaiuscula = !!this.checkPassword.HasLetrasMaiusculas;

    const isValid = this.QtnMinima && this.HasNumero && this.HasCaractereEspecial && this.HasLetraMaiuscula;
    this.isPasswordValid.emit(!isValid);
  }

}

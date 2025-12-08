/* eslint-disable @typescript-eslint/no-explicit-any */
import { Validator, AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';

//Origem  https://pedrohtbranco.com.br/validacao-cpf-e-cnpj-com-angular-12/

export class CpfCnpjValidator implements Validator {

  static cpfLength = 11;
  static cnpjLength = 14;

  /**
  * Calcula o dígito verificador do CPF ou CNPJ.
  */
  static buildDigit(arr: number[]): number {

    const isCpf = arr.length < CpfCnpjValidator.cpfLength;
    const digit = arr
      .map((val, idx) => val * ((!isCpf ? idx % 8 : idx) + 2))
      .reduce((total, current) => total + current) % CpfCnpjValidator.cpfLength;

    if (digit < 2 && isCpf) {
      return 0;
    }
    else if (digit < 2) {
      return 0;
    }

    return CpfCnpjValidator.cpfLength - digit;
  }


  /**
  * Valida um CPF ou CNPJ de acordo com seu dígito verificador.
  */
  // static validate(c: AbstractControl): ValidationErrors | null {
  //   let cpfCnpj: any = "";
  //   if (c.value) cpfCnpj = c.value.replace(/\D/g, '');

  //   if (cpfCnpj === '') {
  //     return null;
  //   }

  //   // Verifica o tamanho da string.
  //   if ([CpfCnpjValidator.cpfLength, CpfCnpjValidator.cnpjLength].indexOf(cpfCnpj.length) < 0) {
  //     return { cpcnpjInvalid: true };
  //   }

  //   // Verifica se todos os dígitos são iguais, exceto para CPF com dígitos zerados.
  //   if (/^([0-9])\1*$/.test(cpfCnpj) && cpfCnpj !== '00000000000') {
  //     return { cpcnpjInvalid: true };
  //   }

  //   // A seguir é realizado o cálculo verificador.
  //   const cpfCnpjArr: number[] = cpfCnpj.split('').reverse().slice(2);

  //   cpfCnpjArr.unshift(CpfCnpjValidator.buildDigit(cpfCnpjArr));
  //   cpfCnpjArr.unshift(CpfCnpjValidator.buildDigit(cpfCnpjArr));

  //   if (cpfCnpj !== cpfCnpjArr.reverse().join('')) {
  //     // Dígito verificador não é válido, resultando em falha.
  //     return { cpcnpjInvalidDigit: true };
  //   }

  //   return null;
  // }

  static validate(c: AbstractControl): ValidationErrors | null {

    let valor = (c.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!valor) return null;

    const isCPF = valor.length === 11;
    const isCNPJ = valor.length === 14;

    if (!isCPF && !isCNPJ) {
      return { cpcnpjInvalid: true };
    }

    // CPF ===========================================
    if (isCPF) {
      if (/^(\d)\1+$/.test(valor) && valor !== '00000000000') return { cpcnpjInvalid: true };

      const calcDV = (base: string) => {
        let soma = 0;
        for (let i = 0; i < base.length; i++) {
          soma += parseInt(base[i], 10) * (base.length + 1 - i);
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
      };

      const dv1 = calcDV(valor.substring(0, 9));
      const dv2 = calcDV(valor.substring(0, 9) + dv1);

      if (valor !== valor.substring(0, 9) + dv1.toString() + dv2.toString()) {
        return { cpcnpjInvalidDigit: true };
      }

      return null;
    }

    // CNPJ ALFANUMÉRICO ===========================================

    // Rejeita todos iguais
    if (/^([A-Z0-9])\1*$/.test(valor) && valor !== '00000000000000') {
      return { cpcnpjInvalid: true };
    }

    // Converte as letras para numeros
    const valores = valor.split('').map((c: string) => {
      return c.charCodeAt(0) - 48;
    });

    const peso1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const peso2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    // DV1
    let soma1 = 0;
    for (let i = 0; i < 12; i++) soma1 += valores[i] * peso1[i];
    const resto1 = soma1 % 11;
    const dv1 = resto1 < 2 ? 0 : 11 - resto1;

    // DV2
    let soma2 = 0;
    for (let i = 0; i < 12; i++) soma2 += valores[i] * peso2[i];
    soma2 += dv1 * peso2[12];

    const resto2 = soma2 % 11;
    const dv2 = resto2 < 2 ? 0 : 11 - resto2;

    // Verifica os DVs
    if (valores[12] !== dv1 || valores[13] !== dv2) {
      return { cpcnpjInvalidDigit: true };
    }

    return null;
  }

  /**
  * Implementa a interface de um validator.
  */
  validate(c: AbstractControl): ValidationErrors | null {
    return CpfCnpjValidator.validate(c);
  }
}

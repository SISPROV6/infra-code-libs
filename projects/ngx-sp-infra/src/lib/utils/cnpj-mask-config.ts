// projects/your-lib/src/lib/cnpj-mask.config.ts
import { NgxMaskConfig } from 'ngx-mask';

export const cnpjMaskConfig: Partial<NgxMaskConfig> = {
    patterns: {
        '0': { pattern: new RegExp('[0-9]') },   // números obrigatórios
        '9': { pattern: new RegExp('[0-9]') },   // números opcionais
        'A': { pattern: new RegExp('[A-Za-z0-9]') }, // letras e números
        'S': { pattern: new RegExp('[A-Za-z]') },    // letras
        'U': { pattern: new RegExp('[A-Z]') },       // maiúsculas
        'L': { pattern: new RegExp('[a-z]') },       // minúsculas
        'D': { pattern: new RegExp('[0-9]') },       // compatibilidade
        'X': { pattern: new RegExp('.+') }           // qualquer caractere
    }
};

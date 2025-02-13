import { FormatByTypePipe } from "./format-by-type.pipe";


describe('Pipe de formatação de texto por tipo', () => {
   // This pipe is a pure, stateless function so no need for BeforeEach
   const pipe = new FormatByTypePipe();
 
   it('quando filtro do tipo "Date("Tue Dec 10 2024 10:36:26 GMT-0300 (Horário Padrão de Brasília)")" estiver presente, deve formatá-lo para "10/12/2024"', () => {
      const values = [
        { label: 'Filtro de data:', value: new Date("Tue Dec 10 2024 10:36:26 GMT-0300 (Horário Padrão de Brasília)") }
      ];
      
      expect(pipe.transform(values[0].value)).toBe('10/12/2024');
   });

   it('quando filtro do tipo "string" com valor "2024-12-01" estiver presente, deve formatá-lo para "01/12/2024"', () => {
      const values = [
        { label: 'Filtro de data:', value: '2024-12-01' }
      ];
      
      expect(pipe.transform(values[0].value)).toBe('01/12/2024');
   });
});
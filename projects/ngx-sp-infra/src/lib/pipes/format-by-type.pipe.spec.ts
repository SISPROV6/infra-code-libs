import { FormatByTypePipe } from "./format-by-type.pipe";


describe('Pipe de formatação de texto por tipo', () => {
   // This pipe is a pure, stateless function so no need for BeforeEach
   const pipe = new FormatByTypePipe();
 
   it('quando filtro do tipo "Date()" estiver presente, deve formatá-lo para "00/00/0000"', () => {
      const values = [
        { label: 'Filtro de data:', value: new Date() }
      ];
      
      expect(pipe.transform(values[0].value)).toBe('09/12/2024');
   });

   it('quando filtro do tipo "string" com valor "2024-12-01" estiver presente, deve formatá-lo para "01/12/2024"', () => {
      const values = [
        { label: 'Filtro de data:', value: '2024-12-01' }
      ];
      
      expect(pipe.transform(values[0].value)).toBe('01/12/2024');
   });
});
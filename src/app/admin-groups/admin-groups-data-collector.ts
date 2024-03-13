export class AdminGroupsDataCollector {
    static collectEventData(result: any[]): any {
        let collectedData: string[] = [];
        console.log(result)
        // Recorrer cada fila de la matriz
        result.forEach(row => {
            let rowString = '';
            row.dias.forEach((value: boolean, index: number) => {
                if (value) {
                    const dayName = this.getDayName(index);
                    const formattedTime = `${row.horas[0]}-${row.horas[1]}`;
                    rowString += `${dayName}[${formattedTime}], `;
                }
            });
            // Eliminar la última coma y espacio
            if (rowString.length > 0) {
                rowString = rowString.slice(0, -2);
            }
            // Agregar la cadena a la lista de datos recolectados
            collectedData.push(rowString);
        });
        // Imprimir cada fila recolectada
        return  {result: collectedData, details: "Succesfully collected data."};
    }

    // Método para obtener el nombre del día según su índice
    static getDayName(index: number): string {
        const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        return daysOfWeek[index];
    }
}

export class AdminGroupsDataCollector {

    static collectEventData(result: any[]) {
        let errorMessage = '';

        const inputTitle = document.getElementById('input-titulo') as HTMLInputElement;
        const inputDescripcion = document.getElementById('input-descripcion') as HTMLInputElement;
        
        result.forEach(row => {
            if(row.horas.hora_inicio === '' || row.horas.hora_fin === '') {
                errorMessage = "Please enter a hour.";
                return;
            }

            let hasSelectedDay = false;
            row.dias.forEach((dia: any) => {
                if(dia) {
                    hasSelectedDay = true;
                }
            });

            if(!hasSelectedDay) {
                errorMessage = "Please select at least one day.";
                return;
            }
        });

        if(errorMessage) {
            return { result: null, details: errorMessage };
        }
    
        const horario = {
            title: inputTitle.value,
            description: inputDescripcion.value,
            horarios: result
        };

        if (!horario.title) {
            return { result: null, details: "Please enter a title." };
        }

        if (!horario.description) {
            return { result: null, details: "Please enter a description." };
        }

        return  { result: horario, horario: "Successfully collected data." };
    }
}

import { input } from "@angular/core";

export class AdminGroupsDataCollector {

    static collectEventData(result: any[]) {
        let errorMessage = '';

        const inputOrganizacion = document.getElementById('organizacion') as HTMLInputElement;
        const inputActividad = document.getElementById('actividad') as HTMLInputElement;
        const inputGrupo = document.getElementById('grupo') as HTMLInputElement;

        if(!inputOrganizacion.value) {
            return { result: null, details: "Escoja una organización" };
        }
        if(!inputActividad.value) {
            return { result: null, details: "Escoja una actividad" };
        }
        if(!inputGrupo.value) {
            return { result: null, details: "Escoja un grupo" };
        }

        const inputTitle = document.getElementById('input-titulo') as HTMLInputElement;
        const inputDescripcion = document.getElementById('input-descripcion') as HTMLInputElement;
        
        result.forEach(row => {
            if(row.horas.startTime === '' || row.horas.endTime === '') {
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
            organizacion: inputOrganizacion.value,
            actividad: inputActividad.value,
            grupo: inputGrupo.value,
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

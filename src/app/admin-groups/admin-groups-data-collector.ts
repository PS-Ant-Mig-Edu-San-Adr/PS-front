import { ElementRef } from "@angular/core";
import { Group } from "../interfaces/interface";

export class AdminGroupsDataCollector {
    static collectEventData(horarios: any[], groups: Group[], inputTitle: ElementRef, inputDescripcion: ElementRef, selectedGroup: Group | undefined ): any {
        let horariosResult = this.validateHorarios(horarios);

        if (horariosResult.result === null) {
            return horariosResult;
        }

        const horario = {
            title: inputTitle.nativeElement.value,
            description: inputDescripcion.nativeElement.value,
            horarios: horariosResult.result,
        };

        if (this.checkEmpty(horario)) {
            return { result: null, details: "Please enter a title and description." };
        }

        if(this.groupExists(groups, selectedGroup, horario.title)){
            return { result: null, details: "Group already exists." };
        }

        if( this.sameData(selectedGroup as Group,horario.title,horario.description) && this.checkEmptySchedule(horario.horarios)){
            return { result: null, details: "No changes detected." };
        }

        return { result: horario, details: "Successfully collected data." };
    }

    private static validateHorarios(horarios: any[]): any {

        for (const row of horarios) {
            if (row.horas.startTime === '' || row.horas.endTime === '') {
                return { result: null, details: "Please enter a start and end time for each row." };
            }

            let hasSelectedDay = row.dias.some((dia: any) => dia);

            if (!hasSelectedDay) {
                return { result: null, details: "Please select at least one day for each row." };
            }
        }
        return { result: this.formatObject(horarios), details: "Successfully validated horarios." };
    }

    private static checkEmpty(horario: any): boolean {
        if (!horario.title) {
            alert("Please enter a title.");
            return true;
        }

        if (!horario.description) {
            alert("Please enter a description.");
            return true;
        }

        return false;
    }


    private static formatObject(horarios: any[]): any {
        const formattedHorarios = horarios.flatMap((horario: { horas: { startTime: Date; endTime: Date; }; dias: boolean[]; }) => {
            const { startTime, endTime } = horario.horas;
            const startDayIndex = 0;
            const formattedDias = horario.dias.map((dia: boolean, index: number) => {
                const dayOfWeek = (startDayIndex + index) % 7;
                if (dia) {
                    const formattedDay = this.getDayString(dayOfWeek);
                    return {
                        day: formattedDay,
                        startTime,
                        endTime
                    };
                }
                return null;
            }).filter((day: any) => day !== null);
    
            return formattedDias;
        });
    
        return formattedHorarios;
    }
    
    private static getDayString(dayOfWeek: number): string {
        const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
        return days[dayOfWeek];
    }

    private static groupExists(groups: Group[], selectedGroup: Group | undefined, title: string): boolean {
        if (!selectedGroup) {
            return false;
        }
        const group = groups.find((group: Group) => group.name === title && group.name !== selectedGroup.name);
        if (group === undefined) {
            return false;
        }else{
            return true;
        }
    }

    private static sameData(group: Group, title: string, description: string): boolean {
        if (group.name === title && group.description === description) {
            return true;
        }
        return false;

    }

    private static checkEmptySchedule(horarios: any[]): boolean {
        if (horarios.length === 0) {
            return true;
        }
        return false;
    }
    
    
    
}

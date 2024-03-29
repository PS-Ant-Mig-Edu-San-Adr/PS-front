// admin-event-data-collector.ts
import { formatDate } from '@angular/common';

export class AdminEventDataCollector {

  static collectEventData() {

    // Get references to HTML elements
    const eventAddedGroups = document.querySelector('input[name="added-groups"]') as HTMLInputElement;
    const eventTitle = document.querySelector('input[name="event-title"]') as HTMLInputElement;
    const eventDescription = document.querySelector('input[name="event-description"]') as HTMLInputElement;
    const eventStart = document.querySelector('input[name="event-start-date"]') as HTMLInputElement;
    const eventEnd = document.querySelector('input[name="event-end-date"]') as HTMLInputElement;
    const eventLocation = document.querySelector('input[name="event-location"]') as HTMLInputElement;
    const eventNotes = document.querySelector('input[name="event-notes"]') as HTMLInputElement;
    const eventAttachFile = document.querySelector('input[name="event-attached-files"]') as HTMLInputElement;
    const selectRepeat = document.querySelector('select[name="event-repeat"]') as HTMLSelectElement;

    // Collect the data
    const eventData  = {
      addedGroups: eventAddedGroups?.value,
      title: eventTitle?.value,
      description: eventDescription?.value,
      start_date: eventStart?.value,
      end_date: eventEnd?.value,
      location: eventLocation?.value,
      notes: eventNotes?.value,
      attachments: eventAttachFile?.value,
      repeat: selectRepeat?.value
    };


    if (!this.validateFormFields(eventData)) {
      return {result: false, details: 'Faltan campos requeridos'}
    }

    const dateCheck = this.checkDate(eventData);
    if (!dateCheck.result) {
      return {result: false, details: dateCheck.details};
    }

    return {result: eventData, details: 'Success!'};
  }
  private static validateFormFields(eventData: any): boolean {
    // Check if any required field is missing
    return !(!eventData || !eventData.addedGroups || !eventData.title || !eventData.description ||
      !eventData.start_date || !eventData.end_date || !eventData.location || !eventData.repeat);

  }

  private static getWeek(date: Date) {
    let tempDate: Date = new Date(date.getTime());

    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() - (tempDate.getDay() === 0 ? 6 : tempDate.getDay() - 1));

    let firstMonday: Date = new Date(tempDate.getFullYear(), 0, 1);
    while (firstMonday.getDay() !== 1) {
      firstMonday.setDate(firstMonday.getDate() + 1);
    }

    let difference = tempDate.getTime() - firstMonday.getTime();

    return Math.ceil(difference / (7 * 24 * 60 * 60 * 1000)) + 1;
  }

  private static checkDate(eventData: any): any{
    const selectedDateStart = eventData.start_date;
    const selectedDateEnd = eventData.end_date;
    const selectedRepeat = eventData.repeat;


    if (selectedRepeat === 'diario') {
      const startDay = new Date(selectedDateStart).getDate();
      const endDay = new Date(selectedDateEnd).getDate();
      if (startDay !== endDay) {
        return {result: false, details: 'Las fechas deben estar en el mismo día si el recordatorio es diario'};
      }
    } else if (selectedRepeat === 'semanal') {
      const startWeek = this.getWeek(new Date(selectedDateStart));
      const endWeek = this.getWeek(new Date(selectedDateEnd));
      if (startWeek !== endWeek) {
        return {result: false, details: 'Las fechas deben estar en la misma semana si el recordatorio es semanal'};
      }
    } else if (selectedRepeat === 'mensual') {
      const startMonth = new Date(selectedDateStart).getMonth();
      const endMonth = new Date(selectedDateEnd).getMonth();
      if (startMonth !== endMonth) {
        return {result: false, details: 'Las fechas deben estar en el mismo mes si el recordatorio es mensual'};
      }
    } else if (selectedRepeat === 'anual') {
      const startYear = new Date(selectedDateStart).getFullYear();
      const endYear = new Date(selectedDateEnd).getFullYear();
      if (startYear !== endYear) {
        return {result: false, details: 'Las fechas deben estar en el mismo año si el recordatorio es anual'};
      }
    }

    console.log("SelectedDateStart: ", selectedDateStart);
    console.log("SelectedDateEnd: ", selectedDateEnd);

    if (selectedDateStart > selectedDateEnd) {
      return {result: false, details: 'La fecha de inicio no puede ser mayor a la fecha de fin'};
    } else if (selectedDateStart === selectedDateEnd) {
      return {result: false, details: 'La fecha de inicio no puede ser igual a la fecha de fin'};
    } else if (selectedDateStart < formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en-US')) {
      return {result: false, details: 'La fecha de inicio no puede ser menor a la fecha actual'};
    }

    return {result: true, details: ''};

  }

}

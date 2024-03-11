// admin-event-data-collector.ts
export class AdminEventDataCollector {
  static collectEventData(): any {

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
    const eventData = {
      addedGroups: eventAddedGroups?.value,
      title: eventTitle?.value,
      description: eventDescription?.value,
      start: eventStart?.value,
      end: eventEnd?.value,
      location: eventLocation?.value,
      notes: eventNotes?.value,
      attachFile: eventAttachFile?.value,
      repeat: selectRepeat?.value
    };

    console.log('Event Data:', eventData);

    // Validate form fields
    if (!this.validateFormFields(eventData)) {
      return null;
    }

    return eventData;
  }
  private static validateFormFields(eventData: any): boolean {
    // Check if any required field is missing
    return !(!eventData || !eventData.addedGroups || !eventData.title || !eventData.description ||
      !eventData.start || !eventData.end || !eventData.location);

  }

}

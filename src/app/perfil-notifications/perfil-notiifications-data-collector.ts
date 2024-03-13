import { User } from "../interfaces/interface";

export class PerfilNotificationsDataCollector {

  static collectUserData(user: User): any {

    const activeNotifications = document.getElementById('active-notifications') as  HTMLInputElement;
    const activeEvent = document.getElementById('active-event') as HTMLInputElement;
    const activeReminder = document.getElementById('active-reminders') as  HTMLInputElement;
    const activeApp = document.getElementById('active-app') as  HTMLInputElement;
    const activeEmail = document.getElementById('active-email') as  HTMLInputElement;

    const eventData = {
      event: activeEvent.value,
      reminder: activeReminder.value,
      app: activeApp.value,
      email: activeEmail.value,
      active: activeNotifications.value
    };


    if ((!eventData.event || !eventData.reminder || !eventData.app || !eventData.email) && eventData.active) {
      return { result: null, details: "An option  must be active" };
    }
    return {result: eventData, details: "Succesfully collected data."};
  }
 

}

import { User } from "../interfaces/interface";

export class PerfilInfoDataCollector {
  static collectUserData(user: User): any {

    // Get references to HTML elements
    const inputUsername = document.getElementById('input-username') as HTMLInputElement;
    const inputPassword = document.getElementById('input-password') as HTMLInputElement;
    const inputEmail = document.getElementById('input-email') as HTMLInputElement;
    const inputZona = document.getElementById('input-zona') as HTMLInputElement;



    // Collect the data
    const eventData = {
      username: inputUsername.value,
      password: inputPassword.value,
      email: inputEmail.value,
      zona: inputZona.value
    };

    // Validate form fields
    if (!this.validateFormFields(eventData)) {
      return {result: null, details: "Please complete all required fields."};
    }

    if (!this.validateUserFields(user, eventData)) {
      return {result: null, details: "Please do not enter the same data as before."};
    }

    // Validate email
    if (eventData.email && !this.validateEmail(eventData.email)) {
      return {result: null, details: "Please enter a valid email."};
    }

    return {result: eventData, details: "Succesfully collected data."};
  }
  private static validateFormFields(eventData: any): boolean {
    // Check if any required field is missing
    return (eventData.username || eventData.password || eventData.email || eventData.zona);

  }

  private static validateEmail(email: string): boolean {
    // Validate email
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
    return emailRegex.test(email);
  }

  static validateUserFields(user: User, eventData: any): boolean {
    return (
      (user.username && user.username === eventData.username) ||
      (user.passwordHash && user.passwordHash === eventData.passwordHash) ||
      (user.email && user.email === eventData.email) ||
      (user.timeZone && user.timeZone === eventData.zona)
    );
  }

}

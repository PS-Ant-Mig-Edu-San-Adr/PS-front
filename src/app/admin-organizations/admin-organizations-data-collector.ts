import { User } from "../interfaces/interface";

export class AdminOrganizationsDataCollector {
  static collectUserData(): any {

    // Get references to HTML elements
    const inputUsername = document.getElementById('input-username') as HTMLInputElement;
    const inputPassword = document.getElementById('input-password') as HTMLInputElement;
    const inputEmail = document.getElementById('input-email') as HTMLInputElement;
    const inputZone = document.getElementById('input-zone') as HTMLInputElement;




    // Collect the data
    const eventData = {
      username: inputUsername.value,
      password: inputPassword.value,
      email: inputEmail.value,
      zona: inputZone.value,
    };

    
    

    return {result: eventData, details: "Succesfully collected data."};
  }

  private static validateFormFields(eventData: any): any {

  }

  

}

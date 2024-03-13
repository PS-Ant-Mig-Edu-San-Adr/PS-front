import { User } from "../interfaces/interface";

export class AdminCreateOrganizationDataCollector {
  static collectUserData(): any {

    // Get references to HTML elements
    const inputName = document.getElementById('input-name') as HTMLInputElement;
    const inputDescription = document.getElementById('input-description') as HTMLInputElement;
    const inputEmail = document.getElementById('input-email') as HTMLInputElement;
    const inputDomain = document.getElementById('input-domain') as HTMLInputElement;
    const inputContact = document.getElementById('input-contact') as HTMLSelectElement;
    const selectPrivacy = document.getElementById('select-privacy') as HTMLSelectElement;

    // Collect the data
    const eventData = {
      name: inputName?.value,
      description: inputDescription?.value,
      email: inputEmail?.value,
      domain: inputDomain?.value,
      contact: inputContact?.value,
      privacy: selectPrivacy?.value
    };

    // Validate the data
    const validationResult = AdminCreateOrganizationDataCollector.validateFormFields(eventData);

    if(eventData.contact && !this.validatePhoneNumber(eventData.contact)){
      return {result: false, details: "Invalid phone number."};
    }

    if (!validationResult.result) {
      return validationResult;
    }
  
    return {result: eventData, details: "Succesfully collected data."};
  }

  private static validateFormFields(eventData: any): any {
    if(!eventData.name){
      return {result: false, details: "Name field is empty."};
    
    }else if(!eventData.description){
      return {result: false, details: "Description field is empty."};
    }else if(!eventData.privacy || (eventData.privacy !== "Público" && eventData.privacy !== "Privado")){
      return {result: false, details: "Privacy field is empty or invalid."};
    }

    return {result: true, details: "Succesfully validated form fields."};
  }

  private static validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+\d{11}$/;
    return phoneRegex.test(phoneNumber);
  }

  

}

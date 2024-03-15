import { ElementRef, ViewChild } from "@angular/core";
import { Organization, User } from "../interfaces/interface";

export class AdminOrganizationsDataCollector {
  static collectUserData(
    organization: Organization,
    inputTitle: string,
    inputDescription: string,
    inputEmail: string,
    inputContact: string,
    inputDomain: string,
    inputPrivacy: string
  ): any {

    
    // Collect the data
    const eventData = {
      name: inputTitle,
      description: inputDescription,
      email: inputEmail,
      contact: inputContact,
      domain: inputDomain,
      privacy: inputPrivacy
    };

    // Validate the organization
    if(!organization) {
      return {result: null, details: "Organization is undefined."};
    }

    // Validate the data
    const validationResult = this.validateEmptyFields(eventData);
    if (!validationResult.result) {
      return {result: null, details: validationResult.details};
    }

    // Validate the data
    const validation = this.validateFormFields(organization, eventData);
    if (!validation) {
      return {result: null, details: "The data is the same as the original."};
    }

    // Validate phone number
    if (eventData.contact && !this.validatePhoneNumber(eventData.contact)) {
      return {result: false, details: "Invalid phone number."};
    }

    return {result: eventData, details: "Succesfully collected data."};
  }

  private static validateFormFields(organization: Organization, eventData: any): any {
    return (
      eventData.name !== organization.name ||
      eventData.description !== organization.description ||
      eventData.email !== organization.email ||
      eventData.contact !== organization.contact ||
      eventData.domain !==  organization.domain ||
      eventData.privacy !== organization.privacy
    );
  }

  private static validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+\d{11}$/;
    return phoneRegex.test(phoneNumber);
  }

  private static validateEmptyFields(eventData: any): any {
    if (!eventData.name) {
      return { result: false, details: "Title field is empty." };
    } else if (!eventData.description) {
      return { result: false, details: "Description field is empty." };
    } else if (!eventData.privacy || (eventData.privacy !== "Público" && eventData.privacy !== "Privado")) {
      return { result: false, details: "Privacy field is empty or invalid." };
    }

    return { result: true, details: "Succesfully validated form fields." };
  }

  

}

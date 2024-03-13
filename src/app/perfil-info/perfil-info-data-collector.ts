import { User } from "../interfaces/interface";

export class PerfilInfoDataCollector {
  static collectUserData(user: User, profilePict: File | undefined): any {

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
      profilePict: profilePict,
    };

    // Validate the data
    if (eventData.profilePict) {
      const imgValidation = this.verifySizeandImg(eventData.profilePict);
      if (imgValidation !== true) {
        return imgValidation;
      }
    }else if (this.validateUserFields(user, eventData)) {
      return {result: null, details: "Please do not enter the same data as before."};
    }

    // Validate email
    if (eventData.email && !this.validateEmail(eventData.email)) {
      return {result: null, details: "Please enter a valid email."};
    }

    // Validate password
    if (eventData.password && ! this.verifyPass(eventData.password)) {
      return {result: null, details: "Please enter a valid password."};
    }

    // Validate image
    

    return {result: eventData, details: "Succesfully collected data."};
  }

  private static verifySizeandImg(file: File): any {
    if (!file) {
      return {result: null, details: "Please enter a file."};
    }
    if (file.size > 10000000) {
      return {result: null, details: "Please enter a file smaller than 10MB."};
    }
    const imgRegex = /^image\/(jpeg|jpg|png)$/; // Expresión regular para tipos de imagen comunes
    if (!imgRegex.test(file.type)) {
        return { result: null, details: "Please enter a valid image file."};
    }
    return true;
  }

  private static verifyPass(password: string): boolean {
    if (password.length < 8) {
      return false;
    }
    
    if (!/[a-z]/.test(password)) {
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      return false;
    }
    
    if (!/\d/.test(password)) {
      return false;
    }
    
    return true;
  }

  private static validateEmail(email: string): boolean {
    // Validate email
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
    return emailRegex.test(email);
  }

  static validateUserFields(user: User, eventData: any): boolean {
    return (
      (user.username && user.username === eventData.username) &&
      (user.email && user.email === eventData.email) &&
      (user.timeZone && user.timeZone === eventData.zona) && 
      (!eventData.password || eventData.password === "")
    );
  }

}

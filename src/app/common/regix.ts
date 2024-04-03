export class validator {
  readonly nameRegex: RegExp = /^[a-zA-Z]+$/;
  readonly gmailRegex: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  readonly mobileRegex: RegExp = /^\d{10}$/;
  readonly passwordRegex: RegExp =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
}

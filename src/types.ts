export interface INote {
  id: number;
  body: string;
}

interface UserLocation {
  city: string;
  postcode: number;
  state: string;
  street: string;
}

export interface User {
  birthdate: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  title: string;
  username: string;
  location: UserLocation;
}

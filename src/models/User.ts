export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
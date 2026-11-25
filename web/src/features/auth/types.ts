export type User = {
  _id: string;   
  name: string;
  email: string;
}

export type AuthResponse = {
  token: string;    
  user: User;     
}

export type LoginInput = { email: string; password: string };
export type RegisterInput = { name: string; email: string; password: string };
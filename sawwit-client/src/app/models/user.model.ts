export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: number;
}

export interface RegisteredUser {
  username: string;
  email: string;
  password: string;
}

export interface LoginUser {
  loginInfo: string;
  password: string;
}

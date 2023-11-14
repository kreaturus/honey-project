export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  phone: string;
}

export interface RegisterResponse {
  user: IUser;
  message: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
  phone: string;
  googleID?: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface IProductView {
  _id: string;
  category: {
    _id: string;
    title: string;
  };
  title: string;
  oldPrice: number;
  actualPrice: number;
  description: string;
  image: string;
  amount: number;
  isActive: boolean;
  isHit: boolean;
}

export interface IProduct {
  _id: string;
  category: string;
  title: string;
  oldPrice: number;
  actualPrice: number;
  description: string;
  image: string;
  amount: number;
  isActive: boolean;
  isHit: boolean;
}

export interface ICategory {
  _id: string;
  title: string;
  description?: string;
  image: string | null;
}

export interface Context {
  userId?: string;
}

export interface PostDocument {
  _id: string;
  title: string;
  category: string;
  description: string;
  user: string;
}

export interface CurrentUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

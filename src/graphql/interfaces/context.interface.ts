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

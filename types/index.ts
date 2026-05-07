export interface Author {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: Author; 
  createdAt: string;
  updatedAt: string;
}
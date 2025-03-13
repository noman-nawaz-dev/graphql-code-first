import { Post } from "../database/schema";

export class PostService {
  static async getPosts() {
    return await Post.find({});
  }
}

import { Post } from "../database/schema";
import { Service } from "typedi";

@Service()
export class PostService {
  async getPosts() {
    return await Post.find({});
  }

  async getPostById(id: string) {
    return await Post.findById(id);
  }
}

import { Comment } from "../database/schema";
import { CreateCommentInput } from "../graphql/models/comment.input";
import { Service } from "typedi";

@Service()
export class CommentService {
  async getComments(skip: number = 0, take?: number) {
    const query = Comment.find({}).skip(skip).populate("post").lean();
    if (take !== undefined) {
      query.limit(take);
    }
    return await query;
  }

  async createComment(comment: CreateCommentInput, userId: string) {
    const commentInput = {
      description: comment.description,
      post: comment.post,
      user: userId,
    };
    return (
      await (await Comment.create(commentInput)).populate("post")
    ).populate("user");
  }
}

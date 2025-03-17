import { Resolver, Query, Mutation, Arg, Ctx, Args } from "type-graphql";
import { Comment } from "../models/comment.model";
import { CommentService } from "../../services/comment.service";
import { CreateCommentInput } from "../models/comment.input";
import { Context } from "../interfaces/context.interface";
import { PaginationArgs } from "../models/pagination.input";
import { Service } from "typedi";
import { Authorized } from "type-graphql";

@Service()
@Authorized()
@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}
  @Query(() => [Comment])
  async comments(@Args() { skip = 0, take }: PaginationArgs) {
    return await this.commentService.getComments(skip, take);
  }

  @Authorized(["ADMIN"])
  @Mutation((returns) => Comment)
  async createComment(
    @Arg("CreateCommentInput") createCommentInput: CreateCommentInput,
    @Ctx() context: Context
  ) {
    if (!context.userId) {
      throw new Error("Authentication required");
    }
    return await this.commentService.createComment(
      createCommentInput,
      context.userId
    );
  }
}

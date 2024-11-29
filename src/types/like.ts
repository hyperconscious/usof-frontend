import { Post } from "./post";
import { User } from "./user";
import { Comment } from "./comment";

export interface Like {
    id: string;
    user: User;
    publishDate: Date;
    entityType: string;
    post?: Post;
    comment?: Comment;
    type: string;
}
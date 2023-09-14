import { BelongsToManyAddAssociationMixin, Model } from "sequelize";
import { ApplicationCommentAttributes } from "./types";
import { CommentModel } from "../comment/model";

export class ApplicationCommentModel extends Model<ApplicationCommentAttributes> {
}
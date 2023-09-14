import { BelongsToManyAddAssociationMixin, Model } from "sequelize";
import { ApplicationAttributes, ApplicationAttributesCreation } from "./types";
import { CommentModel } from "../comment/model";

export class ApplicationModel extends Model<ApplicationAttributes, ApplicationAttributesCreation> {
    public readonly comments?: CommentModel[];
    public addComment!: BelongsToManyAddAssociationMixin<CommentModel, number>;
}
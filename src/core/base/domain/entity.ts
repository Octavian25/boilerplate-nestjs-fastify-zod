import { Types } from 'mongoose';
import { Guard } from '../../logic/guard';

export abstract class Entity<EntityProps> {
  protected props: EntityProps;
  protected _id: Types.ObjectId;

  constructor(props: EntityProps, _id?: Types.ObjectId) {
    this.validateProps(props);
    this.props = props;
    this._id = _id || new Types.ObjectId();
  }

  public static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  public get propsCopy() {
    const propsCopy = {
      _id: this._id,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  private validateProps(props: EntityProps) {
    if (Guard.isEmpty(props)) {
      throw new Error('Entity props should not be empty!');
    }
    if (typeof props !== 'object') {
      throw new Error('Entity props should be an object');
    }
  }
}

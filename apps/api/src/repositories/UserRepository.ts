import User, { IUser } from '../models/User';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+passwordHash');
    }
    return query;
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    });
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    return User.create(data);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

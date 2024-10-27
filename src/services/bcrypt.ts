import bcrypt from "bcryptjs";

class HashService {
  async hashValue(value: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
  }

  async verifyHash(value: string, hashValue: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(value, hashValue);
    return isMatch;
  }
}

const hashService = new HashService();

export default hashService;

import { Settings, ISettings } from '../models/Settings';

export class SettingsRepository {
  async getSettings(): Promise<ISettings> {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return settings;
  }

  async updateSettings(data: Partial<ISettings>): Promise<ISettings> {
    const settings = await this.getSettings();

    // Deep merge using Mongoose set
    Object.keys(data).forEach((key) => {
      // @ts-expect-error dynamic key assignment
      settings[key] = data[key];
    });

    return await settings.save();
  }

  async resetSettings(): Promise<ISettings> {
    await Settings.deleteMany({});
    return await Settings.create({});
  }
}

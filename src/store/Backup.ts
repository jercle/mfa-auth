import { UserSettings } from "../models/settings";

export class Backup implements Module {
  async getModule() {
    UserSettings.updateItems();

    return {
      state: {},
      mutations: {
        setToken(
          state: BackupState,
          args: { service: string; value: boolean }
        ) {
          switch (args.service) {
            default:
              break;
          }
        },
        setEnc(state: BackupState, args: { service: string; value: boolean }) {
          switch (args.service) {
            default:
              break;
          }
        },
      },
      namespaced: true,
    };
  }
}

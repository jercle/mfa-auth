<template>
  <div>
    <!-- File Backup -->
    <div v-show="!exportDisabled">
      <div class="text warning" v-if="!defaultEncryption">
        {{ i18n.export_info }}
      </div>
      <div class="text">
        {{ i18n.backup_file_info }}
      </div>
      <div class="text warning" v-if="unsupportedAccounts">
        {{ i18n.otp_unsupported_warn }}
      </div>
      <div class="text warning" v-if="currentlyEncrypted">
        {{ i18n.phrase_incorrect_export }}
      </div>
      <!-- <a-button-link
        download="authenticator.txt"
        :href="exportOneLineOtpAuthFile"
        v-if="!unsupportedAccounts && isDataLinkSupported"
        >{{ i18n.download_backup }}</a-button-link
      > -->
      <!-- <button
        v-on:click="downloadBackUpOneLineOtpAuthFile()"
        v-if="!unsupportedAccounts && !isDataLinkSupported"
        class="button"
      >
        {{ i18n.download_backup }}
      </button> -->
      <a-button-link
        download="authenticator.json"
        :href="exportFile"
        v-if="unsupportedAccounts && isDataLinkSupported"
        >{{ i18n.download_backup }}</a-button-link
      >
      <!-- <button
        v-on:click="downloadBackUpExportFile()"
        v-if="unsupportedAccounts && !isDataLinkSupported"
        class="button"
      >
        {{ i18n.download_backup }}
      </button> -->
      <a-button-link
        download="authenticator.json"
        :href="exportEncryptedFile"
        v-if="!!defaultEncryption && isDataLinkSupported"
        >{{ i18n.download_enc_backup }}</a-button-link
      >
      <button
        v-on:click="downloadBackUpExportEncryptedFile()"
        v-if="!!defaultEncryption && !isDataLinkSupported"
        class="button"
      >
        {{ i18n.download_enc_backup }}
      </button>
    </div>
    <a-button-link href="import.html">{{ i18n.import_backup }}</a-button-link>
    <br />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { isSafari } from "../../browser";

export default Vue.extend({
  data: function () {
    const exportData = this.$store.state.accounts.exportData;
    const exportEncData = this.$store.state.accounts.exportEncData;
    const key = this.$store.state.accounts.key;

    return {
      unsupportedAccounts: hasUnsupportedAccounts(exportData),
      // exportFile: getBackupFile(exportData),
      exportEncryptedFile: getBackupFile(exportEncData, key),
      // exportOneLineOtpAuthFile: getOneLineOtpBackupFile(exportData),
    };
  },
  computed: {
    defaultEncryption: function () {
      return this.$store.state.accounts.defaultEncryption;
    },
    exportDisabled: function () {
      return this.$store.state.menu.exportDisabled;
    },
    currentlyEncrypted: function () {
      return this.$store.getters["accounts/currentlyEncrypted"];
    },
    backupDisabled: function () {
      return this.$store.state.menu.backupDisabled;
    },
    isDataLinkSupported: function () {
      return !isSafari;
    },
    isBackupServiceSupported: function () {
      return !isSafari;
    },
  },
  methods: {
    // downloadBackUpOneLineOtpAuthFile() {
    //   const exportData = this.$store.state.accounts.exportData;
    //   const t = getOneLineOtpBackupFile(exportData);
    //   window.open(t);
    // },
    // downloadBackUpExportFile() {
    //   const exportData = this.$store.state.accounts.exportData;
    //   const t = getBackupFile(exportData);
    //   window.open(t);
    // },
    downloadBackUpExportEncryptedFile() {
      const exportEncData = this.$store.state.accounts.exportEncData;
      const key = this.$store.state.accounts.key;
      const t = getBackupFile(exportEncData, key);
      window.open(t);
    },
  },
});

function hasUnsupportedAccounts(exportData: { [h: string]: RawOTPStorage }) {
  for (const entry of Object.keys(exportData)) {
    if (
      exportData[entry].type === "battle" ||
      exportData[entry].type === "steam"
    ) {
      return true;
    }
  }
  return false;
}

function getBackupFile(
  entryData: { [hash: string]: RawOTPStorage },
  key?: Object
) {
  if (key) {
    Object.assign(entryData, { key: key });
  }
  let json = JSON.stringify(entryData, null, 2);
  // for windows notepad
  json = json.replace(/\n/g, "\r\n");
  return downloadFileUrlBuilder(json);
}

// function getOneLineOtpBackupFile(entryData: { [hash: string]: RawOTPStorage }) {
//   const otpAuthLines: string[] = [];
//   for (const hash of Object.keys(entryData)) {
//     const otpStorage = entryData[hash];
//     if (otpStorage.issuer) {
//       otpStorage.issuer = removeUnsafeData(otpStorage.issuer);
//     }
//     if (otpStorage.account) {
//       otpStorage.account = removeUnsafeData(otpStorage.account);
//     }
//     const label = otpStorage.issuer
//       ? otpStorage.issuer + ":" + (otpStorage.account || "")
//       : otpStorage.account || "";
//     let type = "";
//     if (otpStorage.type === "totp" || otpStorage.type === "hex") {
//       type = "totp";
//     } else if (otpStorage.type === "hotp" || otpStorage.type === "hhex") {
//       type = "hotp";
//     } else {
//       continue;
//     }

//     const otpAuthLine =
//       "otpauth://" +
//       type +
//       "/" +
//       label +
//       "?secret=" +
//       otpStorage.secret +
//       (otpStorage.issuer ? "&issuer=" + otpStorage.issuer : "") +
//       (type === "hotp" ? "&counter=" + otpStorage.counter : "") +
//       (type === "totp" && otpStorage.period
//         ? "&period=" + otpStorage.period
//         : "") +
//       (otpStorage.digits ? "&digits=" + otpStorage.digits : "") +
//       (otpStorage.algorithm ? "&algorithm=" + otpStorage.algorithm : "");

//     otpAuthLines.push(otpAuthLine);
//   }

//   return downloadFileUrlBuilder(otpAuthLines.join("\r\n"));
// }

function downloadFileUrlBuilder(content: string) {
  const blob = new Blob([content], { type: "application/octet-stream" });
  return URL.createObjectURL(blob);
}

function removeUnsafeData(data: string) {
  return encodeURIComponent(data.split("::")[0].replace(/:/g, ""));
}
</script>

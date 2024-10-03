<template>
  <div>
    <div class="header">
      <span id="menuName">{{ i18n.settings }}</span>
      <div class="icon" id="i-close" v-on:click="hideMenu()">
        <IconArrowLeft />
      </div>
    </div>
    <div id="menuBody">
      <div class="menuList">
        <p v-bind:title="i18n.advisor" v-on:click="showInfo('AdvisorPage')">
          <span><IconAdvisor /></span>{{ i18n.advisor }}
        </p>
      </div>
      <div class="menuList">
        <p v-bind:title="i18n.backup" v-on:click="showInfo('BackupPage')">
          <span><IconExchange /></span>{{ i18n.backup }}
        </p>
        <p
          v-bind:title="i18n.security"
          v-on:click="showInfo('SetPasswordPage')"
        >
          <span><IconLock /></span>{{ i18n.security }}
        </p>
        <p
          v-bind:title="i18n.resize_popup_page"
          v-on:click="showInfo('PreferencesPage')"
        >
          <span><IconWrench /></span>{{ i18n.resize_popup_page }}
        </p>
      </div>
      <div class="menuList"></div>
      <div id="version">Version {{ version }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
// import { syncTimeWithGoogle } from "../../syncTime";

import IconArrowLeft from "../../../svg/arrow-left.svg";
import IconInfo from "../../../svg/info.svg";
import IconExchange from "../../../svg/exchange.svg";
import IconDatabase from "../../../svg/database.svg";
import IconLock from "../../../svg/lock.svg";
// import IconSync from "../../../svg/sync.svg";
import IconWrench from "../../../svg/wrench.svg";
import IconAdvisor from "../../../svg/lightbulb.svg";
import IconComments from "../../../svg/comments.svg";
import IconGlobe from "../../../svg/globe.svg";
import IconCode from "../../../svg/code.svg";
import IconClipboardCheck from "../../../svg/clipboard-check.svg";
import { isFirefox, isSafari } from "../../browser";
import { UserSettings } from "../../models/settings";

export default Vue.extend({
  components: {
    IconArrowLeft,
    IconInfo,
    IconExchange,
    IconDatabase,
    IconLock,
    // IconSync,
    IconWrench,
    IconAdvisor,
    IconComments,
    IconGlobe,
    IconCode,
    IconClipboardCheck,
  },
  computed: {
    version: function () {
      return this.$store.state.menu.version;
    },
    isSupported: {
      get(): boolean {
        return !isSafari;
      },
    },
  },
  methods: {
    hideMenu() {
      this.$store.commit("style/hideMenu");
    },
    openLink(url: string) {
      window.open(url, "_blank");
      return;
    },
    showInfo(tab: string) {
      if (tab === "BackupPage") {
        if (
          this.$store.state.menu.enforcePassword &&
          !this.$store.state.accounts.defaultEncryption
        ) {
          this.$store.commit("style/showInfo");
          this.$store.commit("currentView/changeView", "SetPasswordPage");
          return;
        }
      }

      if (this.$store.getters["accounts/currentlyEncrypted"]) {
        if (tab === "SetPasswordPage") {
          this.$store.commit("notification/alert", this.i18n.phrase_incorrect);
          return;
        }
      }
      this.$store.commit("style/showInfo");
      this.$store.commit("currentView/changeView", tab);
      return;
    },
  },
});
</script>

import axios from "axios";

const WEB_HOOK_URL = process.env.WEB_HOOK!;

export class WebHook {
  constructor() {}

  async sendScreenerNotification(data: any) {
    const response = await axios.post(WEB_HOOK_URL, data);
    return response.data;
  }
}

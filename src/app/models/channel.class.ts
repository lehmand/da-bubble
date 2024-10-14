export class Channel {
  channelId: string;
  channelName: string;
  channelDescription?: string;

  constructor(obj?: any) {
    this.channelId = obj?.channelId || '';
    this.channelName = obj?.channelName || '';
    this.channelDescription = obj?.channelDescription || '';
  }

  public toJSON() {
    return {
      channelId: this.channelId,
      channelName: this.channelName,
      channelDescription: this.channelDescription,
    };
  }
}

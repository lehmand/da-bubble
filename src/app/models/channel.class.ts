export class Channel {
  channelId: string;
  channelName: string;
  channelDescription?: string;
  invitedUser: any []

  constructor(obj?: any) {
    this.channelId = obj?.channelId || '';
    this.channelName = obj?.channelName || '';
    this.channelDescription = obj?.channelDescription || '';
    this.invitedUser = obj?.invitedUser || '';
  }

  public toJSON() {
    return {
      channelId: this.channelId,
      channelName: this.channelName,
      channelDescription: this.channelDescription,
      invitedUser: this.invitedUser
    };
  }
}

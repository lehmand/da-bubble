export class Channel {
  id: string;
  name: string;
  description: string;
  usersId: any []

  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.usersId = obj?.usersId || '';
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      usersId: this.usersId
    };
  }
}

import { FirebaseObjectFactory } from 'angularfire2';

export class Area {
  private Id: string;
  private Name: string;

  getId(): string {
    return this.Id;
  }

  getName(): string {
    return this.Name;
  }
}

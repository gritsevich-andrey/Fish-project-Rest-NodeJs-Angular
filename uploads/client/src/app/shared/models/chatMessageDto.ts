export class ChatMessageDto {
  user: string;
  message: string;
  file: string;

  constructor(user: string, message: string, file: string){
    this.user = user;
    this.message = message;
    this.file = file
  }
}

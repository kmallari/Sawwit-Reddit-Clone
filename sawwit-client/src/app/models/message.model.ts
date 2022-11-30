export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  senderProfilePicture: string;
  roomId: string;
  message: string;
  createdAt: number;
}

import { ITodo } from './todo.interface';
import { IAttachment } from './attachment.interface';

export interface ITodoWithAttachmentDTO {
  todo: ITodo,
  attachment: IAttachment,
}

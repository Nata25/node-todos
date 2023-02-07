export interface IAttachmentMetadata {
  originalname: string,
  encoding: string,
  mimetype: string,
  path: string,
  size: number,
}

export interface IAttachment {
  todoID: string,
  metadata: IAttachmentMetadata,
  attachment: string,
}

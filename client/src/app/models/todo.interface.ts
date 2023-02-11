export interface ITodoBase {
  username: string,
  todo: string,
  isDone: boolean,
  _id?: string,
}

export interface ITodo extends ITodoBase {
  hasAttachment: boolean,
}

export interface ITodoDetails extends ITodoBase {
  details: string,
  originalFileName: string,
}

export interface ITodoForm extends ITodoBase {
  attachment: File,
  details?: string,
}

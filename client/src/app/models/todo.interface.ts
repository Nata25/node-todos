export interface ITodoBase {
  username: string,
  todo: string,
  isDone: boolean,
  dueDate: string, // Date, set on UI
  _id?: string,
}

export interface ITodo extends ITodoBase {
  hasAttachment: boolean,
  createdDate: string, // Date, set on backend
}

export interface ITodoDetails extends ITodoBase {
  details: string,
  originalFileName: string,
  createdDate: string, // Date, set on backend
}

export interface ITodoForm extends ITodoBase {
  attachment: File, // newly added value from file input
  details?: string, // parsed text from the file, which is displayed in a textarea for todo with attachment
}

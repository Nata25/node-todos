export interface ITodoBase {
  username: string,
  todo: string,
  isDone: boolean,
  dueDate: string, // Date, set on UI
}

export interface ITodo extends ITodoBase {
  _id: string,
  hasAttachment: boolean,
  createdDate: string, // Date, set on backend
}

export interface ITodoDetails extends ITodoBase {
  _id: string,
  details: string,
  originalFileName: string,
  createdDate: string, // Date, set on backend
}

export interface ITodoForm extends ITodoBase {
  _id?: string, // optional as for adding new ID won't be available
  attachment: File, // newly added value from file input
  details?: string, // parsed text from the file, which is displayed in a textarea for todo with attachment
}

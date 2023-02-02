export interface ITodo {
  _id: string | number, // id from server or -1
  username: string,
  todo: string,
  isDone: boolean,
}

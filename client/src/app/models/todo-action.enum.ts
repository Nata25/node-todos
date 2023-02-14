export enum TodoAction {
  DELETE = -1,
  UPDATE = 1,
}

export interface ITodoActionTrigger {
  id: string,
  action?: TodoAction, // optional for not to be forced to setting initial value in Behavior Subject
}

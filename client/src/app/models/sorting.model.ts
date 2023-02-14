export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SortableKeys {
  DATE_CREATED = 'createdDate',
  DUE_DATE = 'dueDate',
  TODO = 'todo',
}

export interface ISortingOptions {
  sort: SortableKeys,
  direction: SortDirection,
}

export const defaultSortingOptions: ISortingOptions = {
  sort: SortableKeys.DATE_CREATED,
  direction: SortDirection.DESC,
}

## Todo sample app

BE: **Node.js** + **Express**, **MongoDB** + **mongoose**

FE: **Angular 13**

Learning challenge (in progress).

- [x] User can see all todos in the list (root route). 
- [x] User can populate todos from sample data.
- [x] User can mark todo as done or delete it right from the list of todos.
- [x] When user clicks on a todo, details page opens to the right of the list (child route).
- [x] User can add todo with TXT file attached.
- [x] The content of TXT file attached to the todo is displayed on details page. 
- [x] User can edit todo from details page, i.e. change the title, mark as done/pending, delete or replace attachment.
- [x] If todo is deleted, corresponding attachment is deleted as well.
- [x] User can set and change the todo's creation date/due date.
- [x] Todos in the list are sortable by date created, due date or todo name.

### Scripts

Root-level scripts allow to perform two basic tasks:

1. Run the BE+FE in development mode:

```
npm run dev
```

2. Build Angular app for production and serve it via node server along with api:

```
npm run deploy
```

For more options (like run node server in `inspect` mode or build Angular app with `--watch`), it is recommended to launch BE and FE parts in separate terminal windows and use the scripts from the corresponding folders, i.e. **/server** or **/cilent**.

### Branches

TBD

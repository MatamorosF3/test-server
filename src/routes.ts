import app from './app'
import { post as createPost, put as updatePost, remove as deletePost, getOne as getPost, getAll as getPosts } from "./controllers/post";
import { post as createCategory, put as updateCategory, remove as deleteCategory, getOne as getCategory, getAll as getCategories } from "./controllers/category";
import { post as createUser, put as updateUser, remove as deleteUser, getOne as getUser, getAll as getUsers } from "./controllers/user";
import Auth from './controllers/Auth';

import { checkJwt } from "./middlewares/checkJwt";
import { checkRole } from "./middlewares/checkRole";

app.get('/', (req, res) => {
    res.send({
        "liu": "Laureate International Universities"
    })
});
app.post('/login', Auth.login );

app.post('/category',[checkJwt, checkRole(["ADMIN", "EDITOR"])], createCategory);
app.get('/category',[checkJwt, checkRole(["ADMIN", "EDITOR", "VIEWER"])], getCategories);
app.get('/category/:id', [checkJwt, checkRole(["ADMIN", "EDITOR"])], getCategory);
app.put('/category/:id',[checkJwt, checkRole(["ADMIN", "EDITOR"])], updateCategory);
app.delete('/category/:id', [checkJwt, checkRole(["ADMIN", "EDITOR"])],deleteCategory);

app.post('/post',[checkJwt, checkRole(["ADMIN", "EDITOR"])], createPost);
app.get('/post', [checkJwt, checkRole(["ADMIN", "EDITOR", "VIEWER"])],getPosts);
app.get('/post/:id', [checkJwt, checkRole(["ADMIN", "EDITOR"])],getPost);
app.put('/post/:id', [checkJwt, checkRole(["ADMIN", "EDITOR"])],  updatePost);
app.delete('/post/:id', [checkJwt, checkRole(["ADMIN", "EDITOR"])], deletePost);

app.post('/user', [checkJwt, checkRole(["ADMIN"])], createUser);
app.get('/user', [checkJwt, checkRole(["ADMIN"])], getUsers);
app.get('/user/:id', [checkJwt, checkRole(["ADMIN"])], getUser);
app.put('/user/:id', [checkJwt, checkRole(["ADMIN"])], updateUser);
app.delete('/post/:id', [checkJwt, checkRole(["ADMIN"])], deleteUser);

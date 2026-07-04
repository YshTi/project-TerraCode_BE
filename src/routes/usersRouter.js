import { Router } from "express";
// import { getUserValidations} from '../validations/';
// import { celebrate } from 'celebrate';
import { getUserProfileController } from '../controllers/users/getUserProfileControllers.js'


const usersRouter = Router();

// usersRouter.get('/:id', celebrate(getUserValidations), getUserProfileController); - роут з валідацією

usersRouter.get('/:id', getUserProfileController);

export default usersRouter;
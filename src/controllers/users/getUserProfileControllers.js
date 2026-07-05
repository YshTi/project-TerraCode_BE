
import { UserModel } from "../../models/user.js";
import { StoryModel } from '../../models/story.js';
import createHttpError from "http-errors";



export const getUserProfileController = async (req, res) => {
  const { id } = req.params;

const { page = 1, perPage = 4 } = req.query;
const skip = (page - 1) * perPage;

  const user = await UserModel.findById(id).select('-password');
  if (!user) {
    throw createHttpError (404, 'Користувача не знайдено');
  }

const storiesQuery = StoryModel.find({ ownerId: id }); 

 const [totalStories, stories] = await Promise.all([
    StoryModel.countDocuments({ ownerId: id }),
    storiesQuery.skip(skip).limit(perPage),
  ]);

 const totalPages = Math.ceil(totalStories / perPage);

  res.status(200).json(
    {data: {
       user,
       stories,
       pagination: {
        page,
        perPage,
        totalStories,
        totalPages,
       }
  }
}
  );
};



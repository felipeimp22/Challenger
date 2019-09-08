import * as Yup from 'yup';
import mongoose from 'mongoose';
import axios from 'axios';

const User = mongoose.model('User');

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      cpf: Yup.number().required(),
      password: Yup.string()
        .required()
        .min(6),
      adm: Yup.bool()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: ' Validation fails' });
    }
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create(req.body);
    return res.json(user);
  }

  getAp(req, res) {
    // console.log(gitApi)
  }
}
export default new UserController();

//------------------------------------------------------------------------------
// ------------------------------Insomnia Body-----------------------------------

/**
 * createUser:
  {
	"email":"dsad@dsda.com",
	"cpf": "1234155",
	"password":"dasdadas",
	"adm": false
}
 */

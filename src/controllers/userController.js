import * as Yup from 'yup';
import mongoose from 'mongoose';

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
        .min(6)
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

  // ///////////////////////////////////////////////////////////////////////
  async update(req, res) {
    const data = req.body;
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      cpf: Yup.number().required(),
      password: Yup.string()
        .required()
        .min(6),
      confirmpassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });
    if (!(await schema.isValid(data))) {
      return res.status(400).json({ error: ' Validation fails' });
    }
    const { email, oldPassword } = data;

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ error: ' user dont exist' });
    }
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: ' password does not match' });
    }
    await user.update(data);
    return res.json({
      alterado: true
    });
  }
}

export default new UserController();

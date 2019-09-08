import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth';

const Company = mongoose.model('Company');
const User = mongoose.model('User');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails ' });
    }

    const { email, password } = req.body;

    // Session User
    const user = await User.findOne({ email });

    if (user !== null && user.admin === false) {
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Password does not match' });
      }
      const { id, name } = user;
      return res.json({
        user: {
          id,
          name,
          email
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      });
    }

    // Session Company

    const company = await Company.findOne({ email });

    if (company !== null && company.admin === true) {
      if (!(await bcrypt.compare(password, company.password))) {
        return res.status(401).json({ error: 'Password does not match' });
      }
      const { id, name } = company;
      return res.json({
        user: {
          id,
          name,
          email
        },
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn
        })
      });
    }
    return res.send();
  }
}

export default new SessionController();

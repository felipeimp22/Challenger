import * as Yup from 'yup';
import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

import send from '../config/sendMail';

const User = mongoose.model('User');
const Company = mongoose.model('Company');

class Password {
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

  async forgotPassWord(req, res) {
    const data = req.body;
    const passwordRandom = Math.floor(Math.random() * 999999 + 1);

    const { email } = data;
    const checkEmailUser = await User.findOne({ email }).exec();
    const checkEmailCompany = await Company.findOne({ email }).exec();

    if (checkEmailUser !== null) {
      checkEmailUser.password = passwordRandom;
      console.log("------------>", checkEmailUser.password)
      checkEmailUser.password = await bcrypt.hash(checkEmailUser.password, 8)
      await checkEmailUser.save();
      send({
        from: 'felipeimperio.dev@gmail.com',
        to: 'felipeimperio.dev@gmail.com',
        subject: `${checkEmailUser.email}`,
        html: `<p>${passwordRandom}</p>`
      })
        .then(response => {
          console.log('e-mail enviado');
        })
        .catch(err => {
          console.log('erro');
        });
      return res.json({
        email: true
      });
    }
    if (checkEmailCompany !== null) {

      checkEmailCompany.password = passwordRandom;
      checkEmailCompany.password = await bcrypt.hash(checkEmailCompany.password, 8)
      await checkEmailCompany.save();
      send({
        from: 'felipeimperio.dev@gmail.com',
        to: 'felipeimperio.dev@gmail.com',
        subject: `${checkEmailCompany.email}`,
        html: `<p>${passwordRandom}</p>`
      })
        .then(response => {
          console.log('e-mail enviado');
        })
        .catch(err => {
          console.log('erro');
        });
      return res.json({
        email: true
      });
    }
    if (checkEmailCompany === null || checkEmailUser === null) {
      return res.status(401).json({ message: 'Erro no already email' });
    }
    return res.send();
  }
}
export default new Password();

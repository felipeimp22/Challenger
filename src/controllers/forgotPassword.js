import * as Yup from 'yup';
import mongoose from 'mongoose';


import send from "../config/sendMail"
import { getMaxListeners } from 'cluster';
const User = mongoose.model('User');

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
    const passwordRandom = Math.floor((Math.random() * 999999) + 1);



    const { email } = data;
    let password = passwordRandom
    console.log(password)
    const checkEmail = await User.findOne({ "email": email }).exec();
    checkEmail.password = passwordRandom;

    await checkEmail.save();

    send({
      from: "felipeimperio.dev@gmail.com",
      to: "felipeimperio.dev@gmail.com",
      subject: "Senha, e ai kel curtiu ???????",
      html: `<p>${passwordRandom}</p>`
    }).then(response => {
      console.log("e-mail enviado")
    }).catch(err => {
      console.log("erro")
    })
    return res.json({
      "email": true
    })
  }
}
export default new Password();
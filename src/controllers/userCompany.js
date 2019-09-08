import * as Yup from 'yup';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Company = mongoose.model('Company');
const User = mongoose.model('User');

class UserCompany {
  async index(req, res) {
    const Companys = await Company.find();
    return res.json(Companys);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      cnpj_or_cpf: Yup.number().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: ' Validation fails' });
    }
    const { email, password } = req.body;
    const CompanyExists = await Company.findOne({ email });
    const UserExists = await User.findOne({ email });
    if (CompanyExists || UserExists) {
      return res.status(400).json({ error: 'Company already exists' });
    }

    req.body.password = await bcrypt.hash(password, 8);
    const company = await Company.create(req.body);
    return res.json(company);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails ' });
    }
    const { name, email, cnpj_or_cpf, password } = req.body;
    const companyExists = await Company.findOne({ email });

    if (!companyExists) {
      return res.status(400).json({ error: 'Company not already exists' });
    }
    if (password) {
      req.body.password = await bcrypt.hash(password, 8);
    }
    await Company.updateOne(req.body);

    return res.json({
      name,
      email,
      cnpj_or_cpf
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const company = await Company.findOne({ _id: id });

    if (!company) {
      return res.status(400).json({ error: 'Not id already exists' });
    }
    company.deleted = true;
    await Company.updateOne(company);

    return res.json({ message: 'Account deleted success!' });
  }
}
export default new UserCompany();

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

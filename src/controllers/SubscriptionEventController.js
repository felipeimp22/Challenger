import * as Yup from 'yup';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';

const Events = mongoose.model('Events');
const User = mongoose.model('User');

class UserCompany {
  async store(req, res) {
    const { idEvent } = req.params;
    const idEventExists = await Events.findOne({ _id: idEvent });

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'token not provided' });
    }
    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    const idUser = decoded.id;
    const UserExists = await User.findOne({ _id: idUser });
    if (!idEventExists) {
      return res.status(400).json({ error: 'Error selecting event' });
    }
    if (!UserExists) {
      return res.status(400).json({ error: 'Error selecting user' });
    }
    if (idEventExists.id_admin_event === UserExists.id) {
      return res
        .status(400)
        .json({ error: 'Not allowed to confirm presence at your own event' });
    }
    const events = idEventExists.client_confirmation;
    const confirmExists = events.find(user => user === idUser);
    if (confirmExists) {
      return res.status(400).json({ error: 'Event already confirmated' });
    }

    idEventExists.client_confirmation.push(idUser);
    await Events.updateOne(idEventExists);
    return res.json({
      message: 'Event confirmed',
      list: idEventExists.client_confirmation
    });
  }

  async update(req, res) {
    const { idEvent } = req.params;
    const idEventExists = await Events.findOne({ _id: idEvent });

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'token not provided' });
    }
    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    const idUser = decoded.id;
    const UserExists = await User.findOne({ _id: idUser });
    if (!idEventExists) {
      return res.status(400).json({ error: 'Error selecting event' });
    }
    if (!UserExists) {
      return res.status(400).json({ error: 'Error selecting user' });
    }
    const events = idEventExists.client_confirmation;
    const confirmExists = events.find(user => user === idUser);
    if (!confirmExists) {
      return res.status(400).json({ error: 'Not event confirmated' });
    }
    const removeConfirm = events.filter(user => user !== idUser);
    idEventExists.client_confirmation = removeConfirm;
    await Events.updateOne(idEventExists);
    return res.json({
      message: 'Invitation successfully canceled',
      list: idEventExists.client_confirmation
    });
  }
}
export default new UserCompany();

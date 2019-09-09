import * as Yup from 'yup';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../config/auth';

const Events = mongoose.model('Events');

class EventsController {
  async index(req, res) {
    const events = await Events.find();
    return res.json(events);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name_event: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: ' Validation fails' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'token not provided' });
    }
    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.body.id_admin_event = decoded.id;
    const events = await Events.create(req.body);
    return res.json(events);
  }

  async update(req, res) {
    const { id: _id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'token not provided' });
    }
    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    const events = await Events.findById({
      _id,
      where: { id_admin_event: decoded.id }
    });

    if (!events) {
      return res.status(400).json({ error: 'You cannot change this event' });
    }

    await Events.updateOne(req.body);

    return res.json(events);
  }

  async delete(req, res) {
    const { id: _id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'token not provided' });
    }
    const [, token] = authHeader.split(' ');
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    const events = await Events.findById({
      _id,
      where: { id_admin_event: decoded.id }
    });

    if (!events) {
      return res.status(400).json({ error: 'You cannot delete this event' });
    }
    events.deleted = true;
    await Events.updateOne(events);

    return res.json({ message: 'Events deleted success!' });
  }
}
export default new EventsController();

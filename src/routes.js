import { Router } from "express";
import express from "express";
import axios from 'axios';
import UserController from "./controllers/userController";


const routes = new Router();


routes.post('/users', UserController.store);
routes.get('/get')


module.exports = routes;

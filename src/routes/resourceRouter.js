import { Router } from "express";
import Resource from "../models/resourseModel.js";


const resource = Router();


resource.post('/resources', async (req, res) => {
    try {
      const newResource = new Resource(req.body);
      await newResource.save();
      res.status(201).send(newResource);
    } catch (error) {
      res.status(500).send({ message: 'Error saving resource', error });
    }
});
  
  // Read (GET)
  resource.get('/resources', async (req, res) => {
    try {
      const resources = await Resource.find();
      res.status(200).send(resources);
    } catch (error) {
      res.status(500).send({ message: 'Error retrieving resources', error });
    }
  });
  
  // Update (PUT)
  resource.put('/resources/:id', async (req, res) => {
    try {
      const updatedResource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).send(updatedResource);
    } catch (error) {
      res.status(500).send({ message: 'Error updating resource', error });
    }
  });
  
  // Delete (DELETE)
  resource.delete('/resources/:id', async (req, res) => {
    try {
      await Resource.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: 'Resource deleted successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error deleting resource', error });
    }
  });

export default resource;
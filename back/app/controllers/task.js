const { Task } = require('../models');

const taskController = {
  listTasks: async function (req, res) {
    // Récupérer la liste des taches
    const tasks = await Task.findAll();
    // Renvoyer la liste des taches en json
    res.json(tasks);
  },

  store: async function (req, res) {
    try {
      let { name } = req.body;

      const newTask = await Task.create({ name });

      res.json(newTask);
    } catch (error) {
      console.error(error);
    }
  },

  update: async function (req, res) {
    const { id } = req.params;
    const { name } = req.body;

    const taskToUpdate = await Task.findByPk(id);

    const updatedTask = await taskToUpdate.update({
      name: name,
    });

    res.json(updatedTask);
  },

  destroy: async function (req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const taskToDelete = await Task.findByPk(id);
    await taskToDelete.destroy();
    return res.status(204).json();
  },
};

module.exports = taskController;

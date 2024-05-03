const { Task } = require('../models');

const taskController = {
  listTasks: async function (req, res) {
    // Récupérer la liste des taches
    const tasks = await Task.findAll();
    // Renvoyer la liste des taches en json
    res.json(tasks);
  },

  store: async function(req,res) {
    try {
      let { name } = req.body;
  
      // if(!name || typeof name !== 'string') {
      //   return res
      //   .status(400)
      //   .json({error: 'Le paramètre name est invalide'});
      // }
      // console.log(name);

      const newTask = await Task.create({ name });

      res.json(newTask);

    } catch (error) {
      console.log(error);
    }
    
  }
};

module.exports = taskController;

const taskManager = {
  apiEndpoint: 'http://localhost:3000',

  /**
   * Récupère la liste des tâches depuis l'API.
   */
  fetchAndInsertTasksFromApi: async function (event) {
    // Récupère la liste des tâches à l'aide de la fonction fetch()
    try {
      const response = await fetch(`${taskManager.apiEndpoint}/tasks`);

      const json = await response.json();
      if (!response.ok) {
        throw json;
      }
      // Boucle sur la liste des tâches
      json.forEach((task) => {
        // pour chaque tâche appeler la fonction insertTaskInHtml()
        taskManager.insertTaskInHtml(task);
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  /**
   * Permet de créer une nouvelle tâche sur la page HTML.
   * La fonction a un paramètre, un objet contenant les données de la tâche.
   * Il est composé de 2 propriétés : l'id de la tâche et son nom.
   *
   * Exemple :
   * {
   *   id: 5,
   *   name: 'Faire les courses'
   * }
   *
   * @param {Object} taskData
   */
  insertTaskInHtml: function (taskData) {
    // On récupère le HTML d'une tâche dans le template
    const taskTemplate = document.querySelector('.template-task');
    const newTask = document.importNode(taskTemplate.content, true);

    // On insère les données de la tâche dans le HTML
    newTask.querySelector('.task__name').textContent = taskData.name;
    newTask.querySelector('.task__input-name').value = taskData.name;
    newTask.querySelector('.task__input-id').value = taskData.id;
    newTask.querySelector('.task').dataset.id = taskData.id;

    // On écoute les événements sur les éléments créés
    newTask.querySelector('.task__delete').addEventListener('click', taskManager.handleDeleteButton);

    newTask.querySelector('.task__edit').addEventListener('click', taskManager.handleEditButton);

    newTask.querySelector('.task__edit-form').addEventListener('submit', taskManager.handleEditForm);

    // On insère le HTML de la tâche dans la page
    document.querySelector('.tasks').append(newTask);
  },

  /**
   * Cette fonction est appelée quand le formumaire de création de tâche est soumis.
   *
   * @param {Event} event
   */
  handleCreateForm: async function (event) {
    // Bloquer l'envoi du formulaire
    event.preventDefault();

    try{
    // Récupérer les données du formulaire
    const taskFormData = new FormData(event.currentTarget);

    // Envoyer les données à l'API
    const addTask = await fetch(`${taskManager.apiEndpoint}/tasks`, {
      method: 'POST',
      body: taskFormData,
    });
    const json = await addTask.json();
    if (!addTask.ok) {
      throw json;
    }
    // Après confirmation de l'API insérer la tâche dans la page (il y a une fonction toute prête pour ça ;)
    // en utilisant la valeur de retour de l'API
    taskManager.insertTaskInHtml(json);

    // réinitialiser le formulaire
    const formCreateTask = event.target.closest('form');
      formCreateTask.reset();
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  /**
   * Cette fonction est appelée quand l'utilisateur appuie sur le bouton de suppression.
   *
   * @param {Event} event
   */

  handleDeleteButton: async function (event) {
    try {
    // On récupère l'ID de l'élément à supprimer
    const taskHtmlElement = event.currentTarget.closest('.task');
    const taskId = taskHtmlElement.dataset.id;

    // On envoie la requete de suppression à l'API
    const response = await fetch(`${taskManager.apiEndpoint}/tasks/${taskId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Suppression impossible');
    }
     // On supprime l'élément dans la page HTML
    taskHtmlElement.remove();

  } catch (error) {
    console.log(error);
    return null;
  }
  },

  /**
   * Cette fonction est appelée lors du click sur le bouton "modifier une tâche"
   *
   * @param {Event} event
   */
  handleEditButton: function (event) {
    // On récupère l'élément HTML de la tâche à modifier
    const taskHtmlElement = event.currentTarget.closest('.task');
    // On affiche l'input de modification
    taskHtmlElement.querySelector('.task__edit-form').style.display = 'flex';
    // On masque le titre
    taskHtmlElement.querySelector('.task__name').style.display = 'none';
  },

  /**
   * Cette fonction est appelée quand le formumaire de modification de tâche est soumis.
   *
   * @param {Event} event
   */
  handleEditForm: async function (event) {
    // Bloquer l'envoi du formulaire
    event.preventDefault();

    // On récupère l'élément HTML complet de la tâche à modifier
    const taskHtmlElement = event.currentTarget.closest('.task');

    // Récupérer les données du formulaire
    const taskFormData = new FormData(event.currentTarget);

    // je récupère l'id de la tâche à modifier
    const taskId = taskFormData.get('id');

    console.log(taskFormData);
    // Envoyer les données à l'API
    const updateTask = await fetch(`${taskManager.apiEndpoint}/tasks/${taskId}`, {
      method: 'PATCH',
      body: taskFormData,
    });

    const json = await updateTask.json();
    if (!updateTask.ok) {
      throw json;
    }
    // Après confirmation de l'API modifier le nom de la tâche dans le span.task__name
    const newTitle = taskHtmlElement.querySelector('.task__name');
    newTitle.textContent = json.name;

    // On affiche l'input de modification
    taskHtmlElement.querySelector('.task__edit-form').style.display = 'none';
    // On masque le titre
    taskHtmlElement.querySelector('.task__name').style.display = 'block';
  },
};

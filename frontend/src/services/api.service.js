import API from ".";

// Authentication services
const AuthService = {
  async login(data) {
    // console.log("log service", localStorage.getItem(TOKEN_KEY));
    return await API.post("/auth/login", data);
  },

  async signup(data) {
    // console.log("data",data);
    return await API.post("/auth/signup", data);
  },
};

// Project services
const ProjectService = {
  async getList() {
    return await API.get(`/project`);
  },
  async getByID(id) {
    return await API.get(`/project/${id}`);
  },
};

// Task services
const TaskService = {
  async getList() {
    return await API.get(`/task`);
  },
  async getByID(id) {
    return await API.get(`/task/${id}`);
  },

  async edit(id, data) {
    return await API.put(`/task/${id}`, data);
    // return await axios.put(`${API_URL}/request/${id}`, params, {
    //   headers: authHeader,
    // });
  },
};

// Logs services
export const LogService = {
  async create(data) {
    // console.log("log service", localStorage.getItem(TOKEN_KEY));
    return await API.post("/logs", data);
  },
  async getFilterList(
    type = "Month",
    startDate = new Date(),
    endDate = new Date()
  ) {
    const params = { type };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return await API.get(`/logs/filter`, { params });
  },
  async getList() {
    return await API.get(`/logs/list`);
  },
  async getListByID(id) {
    return await API.get(`/logs/${id}`);
  },
  async getByID(id) {
    return await API.get(`/logs/${id}`);
  },

  async edit(id, data) {
    return await API.put(`/logs/${id}`, data);
  },
  async editStatus(id, slug) {
    const params = {};
    if (slug) params.slug = slug;
    return await API.put(`/logs/status/${id}`, params);
  },
};

export { AuthService, ProjectService, TaskService };

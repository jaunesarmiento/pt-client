var request = require("superagent")
  , baseUrl = "https://www.pivotaltracker.com/services/v5/";

exports = module.exports = Mango;

function Mango(options) {
  options = options || {};
  this.initialize(options);
}

Mango.prototype._stories = [];
Mango.prototype._project = {};

Mango.prototype.initialize = function (options) {
  this.setToken(options.token);
  this.setProjectId(options.projectId);

  if (this._token == null) {
    console.log("Error: Missing API token");
    return;
  }

  if (this._projectId == null) {
    console.log("Error: Missing project id");
    return;
  }
};

Mango.prototype.getToken = function () {
  return this._token;
};

Mango.prototype.setToken = function (token) {
  this._token = token;
};

Mango.prototype.getProjectId = function () {
  return this._projectId;
};

Mango.prototype.setProjectId = function (projectId) {
  this._projectId = projectId;
};

// Fetches the project from Pivotal Tracker
Mango.prototype.fetchProject = function (cb) {
  request
    .get(baseUrl + '/projects/' + this.getProjectId())
    .set('X-TrackerToken', this.getToken())
    .end(function (res) {
      if (res.ok) {
        this._project = res.body;
        cb();
      }
      else {
        console.log("Error: Could not get project with id " + this.getProjectId());
        return;
      }
    });
};

Mango.prototype.fetchStories = function (cb) {
  request
    .get(baseUrl + '/projects/' + this.getProjectId() + 'stories')
    .set('X-TrackerToken', this.getToken())
    .end(function (res) {
      if (res.ok) {
        this._stories = res.body;
        cb();
      }
      else {
        console.log("Error: Could not get stories of project with id " + this.getProjectId());
        return;
      }
    });
};

Mango.prototype.convertStories = function () {

};

// Returns the project that was returned by Pivotal Tracker
Mango.prototype.getProject = function () {
  this.fetchProject(function () {
    return this._project;
  });
};

Mango.prototype.getStories = function () {
  console.log("getStories()");
};

Mango.prototype.getStoriesByStatus = function (status) {

};

Mango.prototype.setStoryStatus = function (status) {

};

// To test:
//var opts = {
  //"projectId": "892984",
  //"token": "c0d4bc0f8ecade8f868ab1c72cccec12"
//}
//var mango = new Mango(opts);
//mango.getProject();

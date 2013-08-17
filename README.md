Mango.js
===

```bash
$ npm install mangojs
```

## Usage

```javascript
var opts = {
  "projectId": "YOUR_PROJECT_ID",
  "token": "YOUR_PIVOTAL_TRACKER_API_KEY"
}

// Initialize Mango.js
var mango = new Mango(opts);

// Start a user story
mango.start("STORY_ID", callback);

// Finish a user story
mango.finish("STORY_ID", callback);

// Deliver a user story
mango.deliver("STORY_ID", callback);

// Accept a user story
mango.accept("STORY_ID", callback);

// Reject a user story
mango.reject("STORY_ID", callback);
```

define({ "api": [
  {
    "type": "del",
    "url": "/artifacts/:id",
    "title": "Delete artifact",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/artifacts/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delArtifact",
    "group": "Artifacts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>artifact's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/artifact.api.js",
    "groupTitle": "Artifacts"
  },
  {
    "type": "get",
    "url": "/artifacts/:id",
    "title": "Request artifact",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/artifacts/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getArtifact",
    "group": "Artifacts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>artifact's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/artifact.api.js",
    "groupTitle": "Artifacts"
  },
  {
    "type": "get",
    "url": "/artifacts",
    "title": "Request artifacts",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/artifacts?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getArtifacts",
    "group": "Artifacts",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of artifacts</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/artifact.api.js",
    "groupTitle": "Artifacts"
  },
  {
    "type": "post",
    "url": "/artifacts",
    "title": "Post new artifact",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/artifacts",
        "type": "curl"
      }
    ],
    "name": "postArtifact",
    "group": "Artifacts",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/artifact.api.js",
    "groupTitle": "Artifacts"
  },
  {
    "type": "put",
    "url": "/artifacts/:id",
    "title": "Edit artifact",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/artifacts/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putArtifact",
    "group": "Artifacts",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>artifact's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/artifact.api.js",
    "groupTitle": "Artifacts"
  },
  {
    "type": "del",
    "url": "/cycles/:id",
    "title": "Delete cycle",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/cycles/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delCycle",
    "group": "Cycles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>cycle's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "get",
    "url": "/cycles/:id",
    "title": "Request cycle",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/cycles/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getCycle",
    "group": "Cycles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>cycle's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "get",
    "url": "/cycles/:id/testcases",
    "title": "Request test cases for this cycle",
    "name": "getCycleTestCases",
    "group": "Cycles",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of test cases</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "get",
    "url": "/cycles",
    "title": "Request cycles",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/cycles?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getCycles",
    "group": "Cycles",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of cycles</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "get",
    "url": "/cycles/:id/testcasestats",
    "title": "Request test cases with statistics for this cycle",
    "name": "getTestCaseStats",
    "group": "Cycles",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of test cases</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "post",
    "url": "/cycles",
    "title": "Post new cycle",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/cycles",
        "type": "curl"
      }
    ],
    "name": "postCycle",
    "group": "Cycles",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "put",
    "url": "/cycles/:id",
    "title": "Edit cycle",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/cycles/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putCycle",
    "group": "Cycles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>cycle's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/cycle.api.js",
    "groupTitle": "Cycles"
  },
  {
    "type": "del",
    "url": "/executions/:id",
    "title": "Delete execution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delExecution",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "get",
    "url": "/executions/:id",
    "title": "Request execution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getExecution",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "get",
    "url": "/executions",
    "title": "Request executions",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/executions?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getExecutions",
    "group": "Executions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of executions</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "post",
    "url": "/executions",
    "title": "Post new execution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/executions",
        "type": "curl"
      }
    ],
    "name": "postExecution",
    "group": "Executions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "put",
    "url": "/executions/:id",
    "title": "Edit execution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putExecution",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "put",
    "url": "/executions/:id/status",
    "title": "Edit execution status",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"status\":\"SUCCESSFUL\"}' -H \"Content-Type: application/json\" http://localhost/api/executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putExecutionStatus",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "put",
    "url": "/executions/:id/steps/:stepIdx/status",
    "title": "Edit execution step status",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"status\":\"SUCCESSFUL\"}' -H \"Content-Type: application/json\" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0",
        "type": "curl"
      }
    ],
    "name": "putStepStatus",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "put",
    "url": "/executions/:id/steps/:stepIdx",
    "title": "Edit execution step",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"status\":\"SUCCESSFUL\"}' -H \"Content-Type: application/json\" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0",
        "type": "curl"
      }
    ],
    "name": "putStepUpdate",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "put",
    "url": "/executions/:id/steps/:stepIdx/artifacts",
    "title": "Edit execution step status",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"status\":\"SUCCESSFUL\"}' -H \"Content-Type: application/json\" http://localhost/api/executions/5af582d1dccd6600137334a0/steps/0/artifacts",
        "type": "curl"
      }
    ],
    "name": "putStepUpdateArtifact",
    "group": "Executions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>execution's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "stepIdx",
            "description": "<p>execution step index</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/execution.api.js",
    "groupTitle": "Executions"
  },
  {
    "type": "del",
    "url": "/projects/:id",
    "title": "Delete project",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/projects/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delProject",
    "group": "Projects",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>project's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:id/cycles",
    "title": "Request project cycles",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/projects/5af582d1dccd6600137334a0/cycles",
        "type": "curl"
      }
    ],
    "name": "getCyclesByProjectId",
    "group": "Projects",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>project's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:id",
    "title": "Request project",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/projects/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getProject",
    "group": "Projects",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>project's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects",
    "title": "Request projects",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/projects?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getProjects",
    "group": "Projects",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of projects</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/projects/:id/cycles",
    "title": "Request project test cases",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/projects/5af582d1dccd6600137334a0/testcases",
        "type": "curl"
      }
    ],
    "name": "getTestCasesByProjectId",
    "group": "Projects",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>project's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "post",
    "url": "/projects",
    "title": "Post new project",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/projects",
        "type": "curl"
      }
    ],
    "name": "postProject",
    "group": "Projects",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "put",
    "url": "/projects/:id",
    "title": "Edit project",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/projects/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putProject",
    "group": "Projects",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>project's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/project.api.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/reports/cycles/:id",
    "title": "Request cycle reports",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/reports/cycles/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getCycleReport",
    "group": "Reports",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "-",
            "description": "<p>report data</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/report.api.js",
    "groupTitle": "Reports"
  },
  {
    "type": "get",
    "url": "/reports/projects/:id",
    "title": "Request project reports",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/reports/projects/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getProjectReport",
    "group": "Reports",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "-",
            "description": "<p>report data</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/report.api.js",
    "groupTitle": "Reports"
  },
  {
    "type": "get",
    "url": "/reports/testsets/:id",
    "title": "Request test set reports",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/reports/testsets/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getTestSetReport",
    "group": "Reports",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "-",
            "description": "<p>report data</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/report.api.js",
    "groupTitle": "Reports"
  },
  {
    "type": "post",
    "url": "/search/cycles/:id/testcases",
    "title": "Search for cycles",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/cycles/:id/testcases",
        "type": "curl"
      }
    ],
    "name": "findCycleTestCases",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of test cases</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/cycles/:id/testsets",
    "title": "Search for test sets in cycle",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/cycles/:id/testsets",
        "type": "curl"
      }
    ],
    "name": "findCycleTestSets",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of test sets</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/cycles",
    "title": "Search for cycles",
    "name": "findCycles",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of cycles</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/executions",
    "title": "Search for executions",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/executions",
        "type": "curl"
      }
    ],
    "name": "findExecutions",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of executions</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/cycles/:id/testcases/findOne",
    "title": "Search for cycles",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/cycles/:id/testcases",
        "type": "curl"
      }
    ],
    "name": "findOneCycleTestCase",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "TestCase",
            "optional": false,
            "field": "-",
            "description": "<p>test case</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/cycles/:id/testsets/findOne",
    "title": "Search for test set in cycle",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/cycles/:id/testsets/findOne",
        "type": "curl"
      }
    ],
    "name": "findOneCycleTestSet",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "TestSet",
            "optional": false,
            "field": "-",
            "description": "<p>testset</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/testcases",
    "title": "Search for testcases",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/testcases",
        "type": "curl"
      }
    ],
    "name": "findTestCases",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of testcases</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/testset-executions",
    "title": "Search for test set executions",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/testset-executions",
        "type": "curl"
      }
    ],
    "name": "findTestSetExecutions",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of test set executions</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/search/testsets",
    "title": "Search for test set resources",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/search/testsets",
        "type": "curl"
      }
    ],
    "name": "postTestSet",
    "group": "Search",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of test sets</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/search.api.js",
    "groupTitle": "Search"
  },
  {
    "type": "del",
    "url": "/testcases/:id",
    "title": "Delete testcase",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/testcases/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delTestCase",
    "group": "TestCases",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testcase's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testcase.api.js",
    "groupTitle": "TestCases"
  },
  {
    "type": "get",
    "url": "/testcases/:id",
    "title": "Request testcase",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testcases/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getTestCase",
    "group": "TestCases",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testcase's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "withParentFlag",
            "description": "<p>if parents should be included</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testcase.api.js",
    "groupTitle": "TestCases"
  },
  {
    "type": "get",
    "url": "/testcases",
    "title": "Request testcases",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testcases?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getTestCases",
    "group": "TestCases",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of testcases</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testcase.api.js",
    "groupTitle": "TestCases"
  },
  {
    "type": "post",
    "url": "/testcases",
    "title": "Post new testcase",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/testcases",
        "type": "curl"
      }
    ],
    "name": "postTestCase",
    "group": "TestCases",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testcase.api.js",
    "groupTitle": "TestCases"
  },
  {
    "type": "put",
    "url": "/testcases/:id",
    "title": "Edit testcase",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/testcases/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putTestCase",
    "group": "TestCases",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testcase's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testcase.api.js",
    "groupTitle": "TestCases"
  },
  {
    "type": "del",
    "url": "/testset-executions/:id",
    "title": "Delete testSetExecution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/testset-executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delTestSetExecution",
    "group": "TestSetExecutions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSetExecution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset-execution.api.js",
    "groupTitle": "TestSetExecutions"
  },
  {
    "type": "get",
    "url": "/testset-executions/:id/next-pending",
    "title": "Request testSetExecution next pending test",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testset-executions/5af582d1dccd6600137334a0/next-pending",
        "type": "curl"
      }
    ],
    "name": "getNextPendingTest",
    "group": "TestSetExecutions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSetExecution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset-execution.api.js",
    "groupTitle": "TestSetExecutions"
  },
  {
    "type": "get",
    "url": "/testset-executions/:id",
    "title": "Request testSetExecution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testset-executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getTestSetExecution",
    "group": "TestSetExecutions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSetExecution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset-execution.api.js",
    "groupTitle": "TestSetExecutions"
  },
  {
    "type": "get",
    "url": "/testset-executions",
    "title": "Request testSetExecutions",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testset-executions?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getTestSetExecutions",
    "group": "TestSetExecutions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of testSetExecutions</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset-execution.api.js",
    "groupTitle": "TestSetExecutions"
  },
  {
    "type": "post",
    "url": "/testset-executions",
    "title": "Post new testSetExecution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/testset-executions",
        "type": "curl"
      }
    ],
    "name": "postTestSetExecution",
    "group": "TestSetExecutions",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset-execution.api.js",
    "groupTitle": "TestSetExecutions"
  },
  {
    "type": "put",
    "url": "/testset-executions/:id",
    "title": "Edit testSetExecution",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/testset-executions/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putTestSetExecution",
    "group": "TestSetExecutions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSetExecution's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset-execution.api.js",
    "groupTitle": "TestSetExecutions"
  },
  {
    "type": "del",
    "url": "/testsets/:id",
    "title": "Delete testSet",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X DEL http://localhost/api/testsets/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "delTestSet",
    "group": "TestSets",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSet's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  },
  {
    "type": "get",
    "url": "/testsets/:id",
    "title": "Request testSet",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testsets/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "getTestSet",
    "group": "TestSets",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSet's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  },
  {
    "type": "get",
    "url": "/testsets/:id/testcases",
    "title": "Request testCases for this testSet",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testsets/5af582d1dccd6600137334a0/testcases",
        "type": "curl"
      }
    ],
    "name": "getTestSetTestCases",
    "group": "TestSets",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSet's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  },
  {
    "type": "get",
    "url": "/testsets/:id/testset-executions",
    "title": "Request testSetExecutions for this testSet",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testsets/5af582d1dccd6600137334a0/executions",
        "type": "curl"
      }
    ],
    "name": "getTestSetTestSetExecutions",
    "group": "TestSets",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSet's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "array",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  },
  {
    "type": "get",
    "url": "/testsets",
    "title": "Request testSets",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://localhost/api/testsets?limit=10&skip=0",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit result number</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>skip first N results</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "sort",
            "description": "<p>sort by field ie. { title: 1 }</p>"
          }
        ]
      }
    },
    "name": "getTestSets",
    "group": "TestSets",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "-",
            "description": "<p>list of testSets</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  },
  {
    "type": "post",
    "url": "/testsets",
    "title": "Post new testSet",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X POST -d '{\"key1\":\"value1\", \"key2\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/testsets",
        "type": "curl"
      }
    ],
    "name": "postTestSet",
    "group": "TestSets",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of newly added element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  },
  {
    "type": "put",
    "url": "/testsets/:id",
    "title": "Edit testSet",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -X PUT -d '{\"key1\":\"value2\"}' -H \"Content-Type: application/json\" http://localhost/api/testsets/5af582d1dccd6600137334a0",
        "type": "curl"
      }
    ],
    "name": "putTestSet",
    "group": "TestSets",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>testSet's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "ok",
            "description": "<p>1 if successful; 0 if  unsuccessful</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of edited element</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/testset.api.js",
    "groupTitle": "TestSets"
  }
] });

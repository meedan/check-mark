/**
 * @flow
 * @relayHash cb2c205bb3bcddd18fc29eef83692bfa
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type SaveMutationVariables = {|
  input: {
    clientMutationId: string;
    media_id?: ?number;
    project_id: number;
    url?: ?string;
    quote?: ?string;
    set_annotation?: ?string;
    set_tasks_responses?: ?any;
  };
|};

export type SaveMutationResponse = {|
  +createProjectMedia: ?{|
    +project_media: ?{|
      +dbid: ?number;
      +project: ?{|
        +dbid: ?number;
        +title: string;
        +team: ?{|
          +slug: string;
          +avatar: ?string;
        |};
      |};
    |};
  |};
|};
*/


/*
mutation SaveMutation(
  $input: CreateProjectMediaInput!
) {
  createProjectMedia(input: $input) {
    project_media {
      dbid
      project {
        dbid
        title
        team {
          slug
          avatar
          id
        }
        id
      }
      id
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "CreateProjectMediaInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SaveMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "CreateProjectMediaInput!"
          }
        ],
        "concreteType": "CreateProjectMediaPayload",
        "name": "createProjectMedia",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "ProjectMedia",
            "name": "project_media",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "dbid",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Project",
                "name": "project",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "dbid",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "Team",
                    "name": "team",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "slug",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "avatar",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "MutationType"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "SaveMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "CreateProjectMediaInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "SaveMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "CreateProjectMediaInput!"
          }
        ],
        "concreteType": "CreateProjectMediaPayload",
        "name": "createProjectMedia",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "ProjectMedia",
            "name": "project_media",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "dbid",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Project",
                "name": "project",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "dbid",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "Team",
                    "name": "team",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "slug",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "avatar",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "id",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation SaveMutation(\n  $input: CreateProjectMediaInput!\n) {\n  createProjectMedia(input: $input) {\n    project_media {\n      dbid\n      project {\n        dbid\n        title\n        team {\n          slug\n          avatar\n          id\n        }\n        id\n      }\n      id\n    }\n  }\n}\n"
};

module.exports = batch;

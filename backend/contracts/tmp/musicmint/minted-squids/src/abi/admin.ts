import {Abi, encodeCall, decodeResult} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0x4c6c090c5d7bf29f2d92ebdbf65a7a959070e4281d6f095ae83218eaa9041e6c",
    "language": "ink! 4.3.0",
    "compiler": "rustc 1.75.0-nightly",
    "build_info": {
      "build_mode": "Release",
      "cargo_contract_version": "3.2.0",
      "rust_toolchain": "nightly-x86_64-apple-darwin",
      "wasm_opt_settings": {
        "keep_debug_symbols": false,
        "optimization_passes": "Z"
      }
    }
  },
  "contract": {
    "name": "admin",
    "version": "0.0.1",
    "authors": [
      "Scio Labs <hello@scio.xyz>"
    ]
  },
  "spec": {
    "constructors": [
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          "Creates a new admin contract initialized with the given owner."
        ],
        "label": "new",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 4
        },
        "selector": "0x9bae9d5e"
      }
    ],
    "docs": [],
    "environment": {
      "accountId": {
        "displayName": [
          "AccountId"
        ],
        "type": 0
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 15
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 18
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 19
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 16
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 17
      }
    },
    "events": [
      {
        "args": [
          {
            "docs": [
              " Granter of the role."
            ],
            "indexed": false,
            "label": "from",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          },
          {
            "docs": [
              " Grantee of the role."
            ],
            "indexed": false,
            "label": "to",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          },
          {
            "docs": [
              " The role granted."
            ],
            "indexed": false,
            "label": "role",
            "type": {
              "displayName": [
                "Role"
              ],
              "type": 13
            }
          },
          {
            "docs": [],
            "indexed": false,
            "label": "contract",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "docs": [
          "Event emitted when a user is granted a role."
        ],
        "label": "Granted"
      }
    ],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 6
    },
    "messages": [
      {
        "args": [
          {
            "label": "new_admin",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Adds the admin role to the given `AccountId`.",
          " The smart contract caller must be the owner."
        ],
        "label": "add_super_admin",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 7
        },
        "selector": "0x4791acdb"
      },
      {
        "args": [
          {
            "label": "admin",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Removes the super admin role from the given `AccountId`.",
          " The smart contract caller must be the owner."
        ],
        "label": "remove_super_admin",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 7
        },
        "selector": "0x0e722d9c"
      },
      {
        "args": [
          {
            "label": "new_admin",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          },
          {
            "label": "new_contract",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Adds the admin role to the given `AccountId`.",
          " The smart contract caller must be a super admin."
        ],
        "label": "add_admin",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 7
        },
        "selector": "0x561367c2"
      },
      {
        "args": [
          {
            "label": "admin",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Removes the admin role from the given `AccountId`.",
          " The smart contract caller must be a super admin."
        ],
        "label": "remove_admin",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 7
        },
        "selector": "0xc0f5e751"
      },
      {
        "args": [
          {
            "label": "admin",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Gets the role of the given `AccountId`.",
          " Returns `[0u8; 32].into()` if the given `AccountId` is not is the mapping."
        ],
        "label": "get_artist_contract",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xc2b8d45d"
      },
      {
        "args": [
          {
            "label": "admin",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          " Gets the smart contract address of the given `AccountId`.",
          " Returns `Role::None` if the given `AccountId` is not is the mapping."
        ],
        "label": "get_role",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 12
        },
        "selector": "0x85f65d55"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Gets all admins.",
          " Returns `Vec<AccountId>` "
        ],
        "label": "get_all_admins",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 14
        },
        "selector": "0x205acb7d"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Gets all super admins.",
          " Returns `Vec<AccountId>` "
        ],
        "label": "get_all_super_admins",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 14
        },
        "selector": "0x230c3c8f"
      }
    ]
  },
  "storage": {
    "root": {
      "layout": {
        "struct": {
          "fields": [
            {
              "layout": {
                "root": {
                  "layout": {
                    "enum": {
                      "dispatchKey": "0x69a00678",
                      "name": "Role",
                      "variants": {
                        "0": {
                          "fields": [],
                          "name": "None"
                        },
                        "1": {
                          "fields": [],
                          "name": "Admin"
                        },
                        "2": {
                          "fields": [],
                          "name": "SuperAdmin"
                        }
                      }
                    }
                  },
                  "root_key": "0x69a00678"
                }
              },
              "name": "admins"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0x358aef92",
                      "ty": 0
                    }
                  },
                  "root_key": "0x358aef92"
                }
              },
              "name": "admins_contracts"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 3
                }
              },
              "name": "admins_accounts"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 3
                }
              },
              "name": "super_admins_accounts"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 0
                }
              },
              "name": "owner"
            }
          ],
          "name": "Admin"
        }
      },
      "root_key": "0x00000000"
    }
  },
  "types": [
    {
      "id": 0,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 1,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "AccountId"
        ]
      }
    },
    {
      "id": 1,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 2
          }
        }
      }
    },
    {
      "id": 2,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 3,
      "type": {
        "def": {
          "sequence": {
            "type": 0
          }
        }
      }
    },
    {
      "id": 4,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 5
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 5
          },
          {
            "name": "E",
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 6,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 1,
                "name": "CouldNotReadInput"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "LangError"
        ]
      }
    },
    {
      "id": 7,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 8
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 8
          },
          {
            "name": "E",
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 8,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 5
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 9
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 5
          },
          {
            "name": "E",
            "type": 9
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 9,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "NotOwner"
              },
              {
                "index": 1,
                "name": "NotSuperAdmin"
              },
              {
                "index": 2,
                "name": "AdminAlreadyExist"
              },
              {
                "index": 3,
                "name": "SuperAdminAlreadyExist"
              }
            ]
          }
        },
        "path": [
          "admin",
          "admin",
          "Error"
        ]
      }
    },
    {
      "id": 10,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 11
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 11
          },
          {
            "name": "E",
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 11,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 0
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 0
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 12,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 13
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 13
          },
          {
            "name": "E",
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 13,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "index": 1,
                "name": "Admin"
              },
              {
                "index": 2,
                "name": "SuperAdmin"
              }
            ]
          }
        },
        "path": [
          "admin",
          "admin",
          "Role"
        ]
      }
    },
    {
      "id": 14,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 3
          },
          {
            "name": "E",
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 15,
      "type": {
        "def": {
          "primitive": "u128"
        }
      }
    },
    {
      "id": 16,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 1,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "Hash"
        ]
      }
    },
    {
      "id": 17,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 18,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 19,
      "type": {
        "def": {
          "variant": {}
        },
        "path": [
          "ink_env",
          "types",
          "NoChainExtension"
        ]
      }
    }
  ],
  "version": "4"
}

const _abi = new Abi(metadata)

export function decodeEvent(hex: string): Event {
    return _abi.decodeEvent(hex)
}

export function decodeMessage(hex: string): Message {
    return _abi.decodeMessage(hex)
}

export function decodeConstructor(hex: string): Constructor {
    return _abi.decodeConstructor(hex)
}

export interface Chain {
    client: {
        call: <T=any>(method: string, params?: unknown[]) => Promise<T>
    }
}

export interface ChainContext {
    _chain: Chain
}

export class Contract {
    constructor(private ctx: ChainContext, private address: string, private blockHash?: string) { }

    get_artist_contract(admin: AccountId): Promise<Result<(AccountId | undefined), LangError>> {
        return this.stateCall('0xc2b8d45d', [admin])
    }

    get_role(admin: AccountId): Promise<Result<Role, LangError>> {
        return this.stateCall('0x85f65d55', [admin])
    }

    get_all_admins(): Promise<Result<AccountId[], LangError>> {
        return this.stateCall('0x205acb7d', [])
    }

    get_all_super_admins(): Promise<Result<AccountId[], LangError>> {
        return this.stateCall('0x230c3c8f', [])
    }

    private async stateCall<T>(selector: string, args: any[]): Promise<T> {
        let input = _abi.encodeMessageInput(selector, args)
        let data = encodeCall(this.address, input)
        let result = await this.ctx._chain.client.call('state_call', ['ContractsApi_call', data, this.blockHash])
        let value = decodeResult(result)
        return _abi.decodeMessageOutput(selector, value)
    }
}

export type Event = Event_Granted

export interface Event_Granted {
    __kind: 'Granted'
    /**
     *  Granter of the role.
     */
    from: AccountId
    /**
     *  Grantee of the role.
     */
    to: AccountId
    /**
     *  The role granted.
     */
    role: Role
    contract: AccountId
}

export type Message = Message_add_super_admin | Message_remove_super_admin | Message_add_admin | Message_remove_admin | Message_get_artist_contract | Message_get_role | Message_get_all_admins | Message_get_all_super_admins

/**
 *  Adds the admin role to the given `AccountId`.
 *  The smart contract caller must be the owner.
 */
export interface Message_add_super_admin {
    __kind: 'add_super_admin'
    newAdmin: AccountId
}

/**
 *  Removes the super admin role from the given `AccountId`.
 *  The smart contract caller must be the owner.
 */
export interface Message_remove_super_admin {
    __kind: 'remove_super_admin'
    admin: AccountId
}

/**
 *  Adds the admin role to the given `AccountId`.
 *  The smart contract caller must be a super admin.
 */
export interface Message_add_admin {
    __kind: 'add_admin'
    newAdmin: AccountId
    newContract: AccountId
}

/**
 *  Removes the admin role from the given `AccountId`.
 *  The smart contract caller must be a super admin.
 */
export interface Message_remove_admin {
    __kind: 'remove_admin'
    admin: AccountId
}

/**
 *  Gets the role of the given `AccountId`.
 *  Returns `[0u8; 32].into()` if the given `AccountId` is not is the mapping.
 */
export interface Message_get_artist_contract {
    __kind: 'get_artist_contract'
    admin: AccountId
}

/**
 *  Gets the smart contract address of the given `AccountId`.
 *  Returns `Role::None` if the given `AccountId` is not is the mapping.
 */
export interface Message_get_role {
    __kind: 'get_role'
    admin: AccountId
}

/**
 *  Gets all admins.
 *  Returns `Vec<AccountId>` 
 */
export interface Message_get_all_admins {
    __kind: 'get_all_admins'
}

/**
 *  Gets all super admins.
 *  Returns `Vec<AccountId>` 
 */
export interface Message_get_all_super_admins {
    __kind: 'get_all_super_admins'
}

export type Constructor = Constructor_new

/**
 * Creates a new admin contract initialized with the given owner.
 */
export interface Constructor_new {
    __kind: 'new'
    owner: AccountId
}

export type AccountId = Uint8Array

export type LangError = LangError_CouldNotReadInput

export interface LangError_CouldNotReadInput {
    __kind: 'CouldNotReadInput'
}

export type Role = Role_None | Role_Admin | Role_SuperAdmin

export interface Role_None {
    __kind: 'None'
}

export interface Role_Admin {
    __kind: 'Admin'
}

export interface Role_SuperAdmin {
    __kind: 'SuperAdmin'
}

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}

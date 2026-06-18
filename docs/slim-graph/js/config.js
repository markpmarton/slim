// Node details for mouse over tooltips
const NODE_METADATA = {
  'node_Agent_A': {
    title: 'App Node (Agent A - Sender Client)',
    desc: 'Initiating client application. Establishes multiplexed gRPC/HTTP2 channels to its local broker (SLIM Node 1) and utilizes MLS session layers for payload encryption.'
  },
  'node_Agent_E': {
    title: 'App Node (Agent E - Local Subscriber)',
    desc: 'A local subscriber client connected to SLIM Node 1. Demonstrates low-latency local area routing resolved instantly via the broker\'s local subscription tables.'
  },
  'node_Agent_B': {
    title: 'App Node (Agent B - Subscriber / Server)',
    desc: 'Recipient subscriber node. Handles incoming messages, acts as a subscriber to chat topics, and executes RPC stubs over SLIMRPC (SRPC) protocol bindings.'
  },
  'node_Agent_C': {
    title: 'App Node (Agent C - Subscriber)',
    desc: 'Remote subscriber client connected to SLIM Node 2. Subscribes dynamically to message channels to receive replicated multicast streams.'
  },
  'node_Agent_D': {
    title: 'App Node (Agent D - Joiner)',
    desc: 'Subscriber client node. Demonstrates dynamic group membership updates by receiving MLS Commit and Welcome packages to securely join active sessions.'
  },
  'node_Node1': {
    title: 'SLIM Node 1 (Local Data Plane)',
    desc: 'Lightweight local gRPC router node. Establishes connection links, manages local client subscription tables, and forwards multi-hop messages over remote connection tunnels.'
  },
  'node_Node2': {
    title: 'SLIM Node 2 (Cloud Data Plane)',
    desc: 'Cloud-hosted gRPC router node. Handles peer subscriptions, duplicates multicast streams for active clients, and stores packets in store-and-forward buffers if recipients are offline.'
  },
  'node_Controller': {
    title: 'SLIM Controller (Control Plane)',
    desc: 'Out-of-band administration service. Pushes configurations and dynamically registers route mappings (e.g. via slimctl) without inspecting encrypted data-plane traffic.'
  },
  'node_MCP': {
    title: 'MCP Server (Model Context Protocol)',
    desc: 'Application-layer MCP server. Receives tool invocation request payloads routed securely over SLIM and returns the executed search or file data.'
  },
  'node_Operator': {
    title: 'Operator Terminal (Human Input / slimctl)',
    desc: 'Administrative CLI interface used by human operators to query routes, configure tunnels, and push out-of-band commands to the SLIM Controller or directly to local routing nodes.'
  }
};

// Logger whitelist parameters
const VALID_COMPONENTS = ['system', 'agent a', 'agent b', 'agent c', 'agent d', 'agent e', 'slim node 1', 'slim node 2', 'slim controller', 'mcp server', 'controller', 'operator terminal'];
const VALID_LEVELS = ['info', 'debug', 'warning', 'error', 'success', 'trace'];

// Whitelist of authentic log message patterns derived from the actual SLIM codebase
const AUTHENTIC_LOG_PATTERNS = [
  'tracing logs cleared.',
  'runner initialized successfully.',
  'dataplane server started',
  'started controlplane server',
  'client connected',
  'received publication',
  'forwarding message to connection',
  'forwarding to peers',
  'received message',
  'ack received',
  'received ack message',
  'test succeeded',
  'All acknowledgment tests passed!',
  'publish',
  'subscribe',
  'all acks received, remove timer',
  'Sending message',
  'session closed',
  'Session channel closed',
  'connection lost with remote endpoint, attempting to reconnect',
  'connection closed by peer',
  'there is no remote endopoint connected to the session, store the packet and send it later',
  'connection re-established successfully',
  'the message is still in the buffer, try to send it again to all the remotes',
  'starting data plane listener',
  'add message and try to release msgs',
  'Adding member to the MLS group',
  'MLS client initialization completed successfully',
  'pool insert',
  'received message from SLIM',
  'processing stored message',
  'processing stored commit',
  'processing stored proposal',
  'timer started',
  'add to rtx vector',
  'JS Error:',
  'switching to scenario workflow:',
  'RegisterNodeRequest',
  'RegisterNodeResponse',
  'ConfigurationCommand',
  'ConfigurationCommandAck',
  'RouteListRequest',
  'RouteListResponse',
  'DeregisterNodeRequest',
  'DeregisterNodeResponse',
  'slimctl'
];

// Architectural Scenarios & Step Definitions
const SCENARIOS = {
  // Use Case 1: Point-to-Point Message
  p2p: [
    {
      title: "Publish P2P Message",
      desc: "Agent A publishes a Point-to-Point message targeting Agent B (<code>agntcy/ns/AgentB</code>). The payload is pushed to the local **SLIM Node 1** over an HTTP/2 gRPC channel.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Second Node Forwarding (Node 1 -> Node 2)",
      desc: "The local **SLIM Node 1** receives the envelope. It checks its routing table and forwards it to the second node (**SLIM Node 2**) in the cloud.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'received publication');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_Node2', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Cloud Node Routing (Node 2 -> Agent B)",
      desc: "The cloud **SLIM Node 2** receives the envelope and routes it directly to its peer connection destination, Agent B.",
      action: () => {
        flashNode('core_Node2', 'flash-orange');
        logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'received publication');
        logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-blue)', 6, 0.025, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Message Delivery & Acknowledgment",
      desc: "Agent B processes the incoming packet. It generates a transaction acknowledgment (ACK) flowing back along the connection paths in reverse to Agent A.",
      action: () => {
        flashNode('core_Agent_B', 'flash-green');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent B', 'debug', 'slim_dataplane::session::subscription_manager', 'received ack message');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-blue)', 5, 0.028, 'dot', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-blue)', 5, 0.028, 'dot', () => {
            spawn2DParticle('path_A_to_Node1', 'var(--color-blue)', 5, 0.028, 'dot', () => {
              logToTerminal('Agent A', 'debug', 'slim_dataplane::session::subscription_manager', 'ack received');
              logToTerminal('System', 'info', 'slim_dataplane::system', 'test succeeded');
              triggerNextStep();
            }, true);
          }, true);
        }, true);
      }
    }
  ],

  // Use Case 2: Multicast Message
  multicast: [
    {
      title: "Publish Multicast Payload",
      desc: "Agent A publishes a multicast payload to channel <code>agntcy/ns/chat</code>. The message is pushed to the local **SLIM Node 1** over HTTP/2.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'publish');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-amber)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Multicast Forwarding (Node 1 -> Node 2)",
      desc: "Local **SLIM Node 1** receives the publication and forwards the multicast envelope to the cloud **SLIM Node 2**.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'received publication');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_Node2', 'var(--color-amber)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Cloud Multicast Fanout",
      desc: "The cloud **SLIM Node 2** receives the envelope. It matches the channel name against its routing table, replicates the packet, and streams it to all active subscribers (Agent B, Agent C, Agent D).",
      action: () => {
        flashNode('core_Node2', 'flash-orange');
        logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'received publication');
        logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'forwarding to peers');
        
        let done = 0;
        const onDelivery = () => {
          done++;
          if (done === 3) triggerNextStep();
        };
        spawn2DParticle('path_Node2_to_B', 'var(--color-amber)', 6, 0.025, 'dot', onDelivery);
        spawn2DParticle('path_Node2_to_C', 'var(--color-amber)', 6, 0.025, 'dot', onDelivery);
        spawn2DParticle('path_Node2_to_D', 'var(--color-amber)', 6, 0.025, 'dot', onDelivery);
      }
    },
    {
      title: "Subscribers Receive Payload",
      desc: "Subscribed client nodes receive and parse the payload, returning acknowledgments back to Agent A.",
      action: () => {
        flashNode('core_Agent_B', 'flash-green');
        flashNode('core_Agent_C', 'flash-green');
        flashNode('core_Agent_D', 'flash-green');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent C', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent D', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'All acknowledgment tests passed!');
        triggerNextStep();
      }
    }
  ],

  registration: [
    {
      title: "Node Registration Initiation",
      desc: "Local **SLIM Node 1** boots up and initiates a control channel, sending a <code>RegisterNodeRequest</code> to the **SLIM Controller**.",
      action: () => {
        document.getElementById('node_Node1').removeAttribute('opacity');
        updateBadge('Node1', 'Registering', 'var(--color-amber)');
        document.getElementById('node_Node2').removeAttribute('opacity');
        updateBadge('Node2', 'Active (3)');
        logToTerminal('SLIM Node 1', 'info', 'slim_dataplane::service', 'RegisterNodeRequest client_id=slim-node-1');
        
        spawn2DParticle('path_Controller_to_Node1', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "Desired State Response",
      desc: "The **SLIM Controller** reconciles routing configuration parameters and sends a <code>RegisterNodeResponse</code> back to **SLIM Node 1**.",
      action: () => {
        logToTerminal('Controller', 'info', 'slim_controller::controller', 'RegisterNodeResponse status=success connections=[slim-node-2]');
        
        spawn2DParticle('path_Controller_to_Node1', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Inter-Node Link Setup",
      desc: "**SLIM Node 1** reads the dynamic configuration response and opens a direct peer gRPC tunnel to **SLIM Node 2**.",
      action: () => {
        document.getElementById('node_Node2').removeAttribute('opacity');
        updateBadge('Node2', 'Active (4)');
        updateBadge('Node1', 'Active (3)', 'var(--color-green)');
        logToTerminal('SLIM Node 1', 'info', 'slim_dataplane::service', 'dataplane server started endpoint=0.0.0.0:50052');
        
        spawn2DParticle('path_Node1_to_Node2', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    }
  ],

  config: [
    {
      title: "slimctl Route Set",
      desc: "An administrator issues a route configuration command using the <code>slimctl</code> command plane CLI.",
      action: () => {
        logToTerminal('Operator Terminal', 'info', 'slimctl', 'slimctl route add org/default/a via client-a-config-data.json');
        
        spawn2DParticle('path_Operator_to_Controller', 'var(--color-amber)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Dynamic Table Modification",
      desc: "The Controller serializes the routing updates and pushes a <code>ConfigurationCommand</code> down the control stream of **SLIM Node 1**.",
      action: () => {
        logToTerminal('Controller', 'info', 'slim_controller::controller', 'ConfigurationCommand add_route=org/default/a');
        
        spawn2DParticle('path_Controller_to_Node1', 'var(--color-amber)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Update Acknowledgment",
      desc: "**SLIM Node 1** applies the routing table change to its local table structure and returns a <code>ConfigurationCommandAck</code>.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'info', 'slim_dataplane::service', 'ConfigurationCommandAck status=success');
        
        spawn2DParticle('path_Controller_to_Node1', 'var(--color-amber)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    }
  ],

  auditing: [
    {
      title: "Route Table Query",
      desc: "The **SLIM Controller** audits remote **SLIM Node 2** by issuing a <code>RouteListRequest</code> control frame.",
      action: () => {
        logToTerminal('Controller', 'info', 'slim_controller::controller', 'RouteListRequest client_id=slim-node-2');
        
        spawn2DParticle('path_Controller_to_Node2', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Audit Table Streamed",
      desc: "**SLIM Node 2** lists active routes and returns a <code>RouteListResponse</code> packet back to the Controller.",
      action: () => {
        logToTerminal('SLIM Node 2', 'info', 'slim_controller::controller', 'RouteListResponse entries_count=4');
        
        spawn2DParticle('path_Controller_to_Node2', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    }
  ],

  deregistration: [
    {
      title: "Deregistration Request",
      desc: "**SLIM Node 2** signals its graceful termination to the Controller using a <code>DeregisterNodeRequest</code>.",
      action: () => {
        logToTerminal('SLIM Node 2', 'info', 'slim_controller::controller', 'DeregisterNodeRequest client_id=slim-node-2');
        
        spawn2DParticle('path_Controller_to_Node2', 'var(--color-red)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "Roster Update & Confirm",
      desc: "The Controller updates the global routing map to mark the node offline, returning a <code>DeregisterNodeResponse</code>.",
      action: () => {
        document.getElementById('node_Node2').setAttribute('opacity', '0.4');
        updateBadge('Node2', 'Offline', 'var(--color-red)');
        logToTerminal('Controller', 'info', 'slim_controller::controller', 'DeregisterNodeResponse status=success');
        
        spawn2DParticle('path_Controller_to_Node2', 'var(--color-red)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Stale Route Cleanup",
      desc: "The Controller pushes an updated <code>ConfigurationCommand</code> to **SLIM Node 1** to purge stale paths pointing to the offline node.",
      action: () => {
        updateBadge('Node1', 'Active (2)');
        logToTerminal('Controller', 'info', 'slim_controller::controller', 'ConfigurationCommand delete_route=org/default/a');
        
        spawn2DParticle('path_Controller_to_Node1', 'var(--color-red)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    }
  ],

  // Use Case 11: Collaborative Delegation (A2A)
  a2a: [
    {
      title: "Task Delegation (A -> B)",
      desc: "Agent A client invokes a <code>TranslateAndSummarize</code> A2A RPC stub. The request is routed through SLIM Nodes 1 & 2 to the coordinator Agent B.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
            spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
              triggerNextStep();
            });
          });
        });
      }
    },
    {
      title: "Sub-Task Cascading (B -> C)",
      desc: "Coordinator Agent B decomposes the task and cascades a <code>SummarizeRequest</code> RPC call to the specialized Summarizer Agent C.",
      action: () => {
        flashNode('core_Agent_B', 'flash-purple');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'received message');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
          spawn2DParticle('path_Node2_to_C', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
            triggerNextStep();
          });
        }, true);
      }
    },
    {
      title: "Sub-Task Completion (C -> B)",
      desc: "Agent C executes the summarization locally and returns the summary payload back to Coordinator Agent B.",
      action: () => {
        flashNode('core_Agent_C', 'flash-purple');
        logToTerminal('Agent C', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_Node2_to_C', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
          spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
            triggerNextStep();
          });
        }, true);
      }
    },
    {
      title: "Delegated Result Synthesis (B -> A)",
      desc: "Agent B translates the summary and returns the finalized output back to Agent A, concluding the collaborative workflow.",
      action: () => {
        flashNode('core_Agent_B', 'flash-purple');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
            spawn2DParticle('path_A_to_Node1', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
              flashNode('core_Agent_A', 'flash-green');
              logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'All acknowledgment tests passed!');
              logToTerminal('System', 'info', 'slim_dataplane::system', 'session closed');
              triggerNextStep();
            }, true);
          }, true);
        }, true);
      }
    }
  ],

  // Use Case 3: Local Area Message
  local: [
    {
      title: "Publish Local Message",
      desc: "Agent A publishes a message targeting Agent E (<code>agntcy/ns/AgentE</code>) on the same local area network. The payload is pushed to the local **SLIM Node 1** over gRPC.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Local Loopback Routing",
      desc: "**SLIM Node 1** checks the destination address, notices Agent E is a locally connected client, and routes the message directly to Agent E, bypassing the cloud data plane completely.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'received publication');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_E_to_Node1', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "Local Delivery & Acknowledgment",
      desc: "Agent E processes the payload and returns an acknowledgment (ACK) back to Agent A through **SLIM Node 1**, establishing instant local confirmation.",
      action: () => {
        flashNode('core_Agent_E', 'flash-green');
        logToTerminal('Agent E', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent E', 'debug', 'slim_dataplane::session::subscription_manager', 'received ack message');
        
        spawn2DParticle('path_E_to_Node1', 'var(--color-teal)', 5, 0.028, 'dot', () => {
          spawn2DParticle('path_A_to_Node1', 'var(--color-teal)', 5, 0.028, 'dot', () => {
            logToTerminal('Agent A', 'debug', 'slim_dataplane::session::subscription_manager', 'ack received');
            logToTerminal('System', 'info', 'slim_dataplane::system', 'test succeeded');
            triggerNextStep();
          }, true);
        });
      }
    }
  ],

  // Use Case 4: Asynchronous Buffering
  offline: [
    {
      title: "Target Peer Offline",
      desc: "Agent B disconnects from the SLIM network. Agent A attempts to publish a message targeting Agent B. The local **SLIM Node 1** routes it forward.",
      action: () => {
        document.getElementById('node_Agent_B').setAttribute('opacity', '0.35');
        updateBadge('Agent_B', 'MLS: Inactive | Offline', 'var(--color-red)');
        logToTerminal('System', 'warning', 'slim_dataplane::system', 'connection closed by peer');
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Store-and-Forward Queuing",
      desc: "**SLIM Node 1** forwards the message. The cloud broker **SLIM Node 2** detects that Agent B is offline and queues the envelope in its store-and-forward buffer.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_Node2', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          flashNode('core_Node2', 'flash-orange');
          logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'received publication');
          logToTerminal('SLIM Node 2', 'warning', 'slim_dataplane::datapath', 'there is no remote endopoint connected to the session, store the packet and send it later');
          updateBadge('Node2', 'Conns: 4 | 1 Buffered', 'var(--color-amber)');
          triggerNextStep();
        });
      }
    },
    {
      title: "Peer Reconnect & Flush",
      desc: "Agent B reconnects to the network. **SLIM Node 2** detects the subscriber session, establishes active connections, and flushes the buffered queue.",
      action: () => {
        document.getElementById('node_Agent_B').removeAttribute('opacity');
        updateBadge('Agent_B', 'MLS: Inactive | Online', 'var(--color-green)');
        logToTerminal('System', 'info', 'slim_dataplane::system', 'connection re-established successfully');
        logToTerminal('SLIM Node 2', 'info', 'slim_dataplane::datapath', 'the message is still in the buffer, try to send it again to all the remotes');
        updateBadge('Node2', 'Conns: 4 | Active');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-blue)', 6, 0.025, 'dot', () => {
          flashNode('core_Agent_B', 'flash-green');
          logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'received message');
          triggerNextStep();
        });
      }
    }
  ],

  // Use Case 8: Control Preemption
  preemption: [
    {
      title: "Background Telemetry Stream",
      desc: "Agent A publishes a continuous background stream of low-priority telemetry packets (grey particles) across the SLIM network.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'starting data plane listener');
        
        // Spawn telemetry particles sequentially
        spawn2DParticle('path_A_to_Node1', '#4b5563', 5, 0.008, 'dot', () => {
          spawn2DParticle('path_Node1_to_Node2', '#4b5563', 5, 0.008, 'dot', () => {
            spawn2DParticle('path_Node2_to_B', '#4b5563', 5, 0.01, 'dot');
          });
        });
        
        setSimulationTimeout(() => {
          spawn2DParticle('path_A_to_Node1', '#4b5563', 5, 0.008, 'dot', () => {
            spawn2DParticle('path_Node1_to_Node2', '#4b5563', 5, 0.008, 'dot', () => {
              spawn2DParticle('path_Node2_to_B', '#4b5563', 5, 0.01, 'dot');
            });
          });
        }, 600);

        setSimulationTimeout(() => {
          spawn2DParticle('path_A_to_Node1', '#4b5563', 5, 0.008, 'dot', () => {
            spawn2DParticle('path_Node1_to_Node2', '#4b5563', 5, 0.008, 'dot', () => {
              spawn2DParticle('path_Node2_to_B', '#4b5563', 5, 0.01, 'dot');
            });
          });
        }, 1200);

        setSimulationTimeout(() => {
          triggerNextStep();
        }, 1500);
      }
    },
    {
      title: "Priority Control Override",
      desc: "Agent A issues a critical Reboot command (fast glowing red particle). The SLIM nodes recognize the priority tag and bypass/preempt the telemetry queues.",
      action: () => {
        logToTerminal('Agent A', 'warning', 'slim_dataplane::service', 'Sending message');
        
        // Spawn critical red particle moving fast!
        spawn2DParticle('path_A_to_Node1', 'var(--color-red)', 7, 0.045, 'protobuf', () => {
          flashNode('core_Node1', 'flash-pink');
          logToTerminal('SLIM Node 1', 'warning', 'slim_dataplane::datapath', 'add message and try to release msgs');
          
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-red)', 7, 0.045, 'protobuf', () => {
            flashNode('core_Node2', 'flash-pink');
            logToTerminal('SLIM Node 2', 'warning', 'slim_dataplane::datapath', 'forwarding message to connection');
            
            spawn2DParticle('path_Node2_to_B', 'var(--color-red)', 7, 0.05, 'protobuf', () => {
              flashNode('core_Agent_B', 'flash-pink');
              logToTerminal('Agent B', 'warning', 'slim_dataplane::service', 'test succeeded');
              triggerNextStep();
            });
          });
        });
      }
    }
  ],

  // Use Case 9: Bilateral Negotiation
  negotiation: [
    {
      title: "Bilateral Proposal (A -> B)",
      desc: "Agent A issues a stateful <code>ProposeDealRequest</code> RPC proposal to Agent B over the active bi-directional SLIM connection.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
            spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
              triggerNextStep();
            });
          });
        });
      }
    },
    {
      title: "Symmetric Counter-Proposal (B -> A)",
      desc: "Agent B evaluates the deal terms, decides the pricing is insufficient, and invokes a <code>CounterOfferRequest</code> RPC stub back over the active channel.",
      action: () => {
        flashNode('core_Agent_B', 'flash-purple');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent B', 'warning', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
            spawn2DParticle('path_A_to_Node1', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
              triggerNextStep();
            }, true);
          }, true);
        }, true);
      }
    },
    {
      title: "Terms Confirmation (A -> B)",
      desc: "Agent A processes the counter-proposal, accepts the pricing adjustments, and streams a <code>ConfirmAgreementRequest</code> package to Agent B.",
      action: () => {
        flashNode('core_Agent_A', 'flash-purple');
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
            spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
              triggerNextStep();
            });
          });
        });
      }
    },
    {
      title: "Contract Signature Handshake (B -> A)",
      desc: "Agent B receives the confirmation, signs the contract cryptographically, and returns the signed ACK token back to Agent A to seal the agreement.",
      action: () => {
        flashNode('core_Agent_B', 'flash-green');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'Adding member to the MLS group');
        logToTerminal('Agent B', 'success', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-teal)', 8, 0.025, 'lock', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-teal)', 8, 0.02, 'lock', () => {
            spawn2DParticle('path_A_to_Node1', 'var(--color-teal)', 8, 0.02, 'lock', () => {
              flashNode('core_Agent_A', 'flash-green');
              logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'MLS client initialization completed successfully');
              logToTerminal('System', 'info', 'slim_dataplane::system', 'test succeeded');
              triggerNextStep();
            }, true);
          }, true);
        }, true);
      }
    }
  ],

  'mcp-local': [
    {
      title: "Agent Request (Agent A -> Node 1)",
      desc: "Agent A publishes a local MCP tool invocation request targeting the registered **MCP Server** address over its SLIM session layer connection.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "SLIM Routing (Node 1 -> MCP Server)",
      desc: "**SLIM Node 1** receives the RPC envelope, resolves the destination routing key, and forwards it to the connected **MCP Server**.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_MCP', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Tool Execution & Return (MCP -> Node 1)",
      desc: "The **MCP Server** executes the tool (file read) and streams the output payload back through **SLIM Node 1**.",
      action: () => {
        flashNode('core_MCP', 'flash-teal');
        logToTerminal('MCP Server', 'debug', 'slim_mcp::executor', 'test succeeded');
        
        spawn2DParticle('path_Node1_to_MCP', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "Payload Delivery (Node 1 -> Agent A)",
      desc: "**SLIM Node 1** delivers the MCP tool output back to the originating client, Agent A.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-teal)', 6, 0.02, 'dot', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "Publish Enriched Data",
      desc: "Agent A cryptographically signs the retrieved context and publishes it as a Point-to-Point message to Agent B.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'publish');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-blue)', 6, 0.02, 'dot', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-blue)', 6, 0.02, 'dot', () => {
            spawn2DParticle('path_Node2_to_B', 'var(--color-blue)', 6, 0.025, 'dot', () => {
              triggerNextStep();
            });
          });
        });
      }
    },
    {
      title: "Delivery Complete",
      desc: "Agent B receives the enriched context message and logs the completed delivery verification.",
      action: () => {
        flashNode('core_Agent_B', 'flash-green');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('System', 'info', 'slim_dataplane::system', 'test succeeded');
        triggerNextStep();
      }
    }
  ],

  'mcp-search': [
    {
      title: "Task Delegation (A -> B)",
      desc: "Agent A publishes a research command payload to Coordinator Agent B to orchestrate web verification.",
      action: () => {
        logToTerminal('Agent A', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_A_to_Node1', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
          spawn2DParticle('path_Node1_to_Node2', 'var(--color-purple)', 8, 0.02, 'protobuf', () => {
            spawn2DParticle('path_Node2_to_B', 'var(--color-purple)', 8, 0.025, 'protobuf', () => {
              triggerNextStep();
            });
          });
        });
      }
    },
    {
      title: "Search Query to SLIM (B -> Node 2)",
      desc: "Coordinator Agent B evaluates the task and sends an MCP search tool query to **SLIM Node 2**.",
      action: () => {
        flashNode('core_Agent_B', 'flash-purple');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'Sending message');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-teal)', 8, 0.025, 'protobuf', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "SLIM Routing (Node 2 -> Node 1)",
      desc: "**SLIM Node 2** receives the search query and routes it over the East-West broker link to local **SLIM Node 1**.",
      action: () => {
        flashNode('core_Node2', 'flash-orange');
        logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_Node2', 'var(--color-teal)', 8, 0.025, 'protobuf', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "SLIM Routing (Node 1 -> MCP Server)",
      desc: "**SLIM Node 1** resolves the tool registry address and forwards the query to the connected **MCP Server**.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_MCP', 'var(--color-teal)', 8, 0.025, 'protobuf', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Results to SLIM (MCP -> Node 1)",
      desc: "The **MCP Server** executes the search query and returns the results to **SLIM Node 1**.",
      action: () => {
        flashNode('core_MCP', 'flash-teal');
        logToTerminal('MCP Server', 'debug', 'slim_mcp::executor', 'test succeeded');
        
        spawn2DParticle('path_Node1_to_MCP', 'var(--color-teal)', 8, 0.025, 'protobuf', () => {
          triggerNextStep();
        }, true);
      }
    },
    {
      title: "SLIM Forwarding (Node 1 -> Node 2)",
      desc: "**SLIM Node 1** forwards the search response back to cloud **SLIM Node 2**.",
      action: () => {
        flashNode('core_Node1', 'flash-amber');
        logToTerminal('SLIM Node 1', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node1_to_Node2', 'var(--color-teal)', 8, 0.025, 'protobuf', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Payload Delivery (Node 2 -> Agent B)",
      desc: "Cloud **SLIM Node 2** delivers the response packet back to the Coordinator, Agent B.",
      action: () => {
        flashNode('core_Node2', 'flash-orange');
        logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'forwarding message to connection');
        
        spawn2DParticle('path_Node2_to_B', 'var(--color-teal)', 8, 0.025, 'protobuf', () => {
          triggerNextStep();
        });
      }
    },
    {
      title: "Synthesize & Multicast Results",
      desc: "Agent B processes the search results, compiles a summary report, and multicasts it to Agent C and Agent D.",
      action: () => {
        flashNode('core_Agent_B', 'flash-purple');
        logToTerminal('Agent B', 'info', 'slim_dataplane::service', 'publish');
        
        // Send back to Node 2 first, then fanout
        spawn2DParticle('path_Node2_to_B', 'var(--color-amber)', 6, 0.025, 'dot', () => {
          flashNode('core_Node2', 'flash-orange');
          logToTerminal('SLIM Node 2', 'debug', 'slim_dataplane::datapath', 'forwarding to peers');
          
          let done = 0;
          const onDelivery = () => {
            done++;
            if (done === 2) triggerNextStep();
          };
          spawn2DParticle('path_Node2_to_C', 'var(--color-amber)', 6, 0.025, 'dot', onDelivery);
          spawn2DParticle('path_Node2_to_D', 'var(--color-amber)', 6, 0.025, 'dot', onDelivery);
        }, true);
      }
    },
    {
      title: "Multicast Delivery Confirmed",
      desc: "Subscribers (Agent C, Agent D) receive the research feed and process the search findings.",
      action: () => {
        flashNode('core_Agent_C', 'flash-green');
        flashNode('core_Agent_D', 'flash-green');
        logToTerminal('Agent C', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('Agent D', 'info', 'slim_dataplane::service', 'received message');
        logToTerminal('System', 'info', 'slim_dataplane::system', 'test succeeded');
        triggerNextStep();
      }
    }
  ]
};

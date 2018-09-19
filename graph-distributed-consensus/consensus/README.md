# Distributed consensus algorithm within a p2p network of "trust" nodes.

This algorithm simulates a network that is a directed random graph, where each edge represents a trust relationship. For example, if there is an A → B edge, it means that Node B listens to transactions broadcast by node A. We say that B is A’s follower and A is B’s followee.

Each node should succeed in achieving consensus with a network in which its peers are other nodes running the same code.A network of nodes receiving different sets of transactions should agree on a set to be accepted.

Each node will be given its list of followees via an array whose indices correspond to nodes in the graph and a list of transactions (its proposal list) that it can broadcast to its followers.

In testing, the network may encounter a number (up to 45%) of malicious nodes that do not cooperate with the consensus algorithm. Malicious nodes may have arbitrary behavior like  broadcasting its own set of transactions, the network withstands  as many malicious nodes as possible and still achieve consensus.It also identifies and notifies about the malicious nodes and transactions.

# The simulation algorithm does the following.
- Spins nodes as concurrent goroutines that will form the p2p network.
- Most of the nodes are good nodes that are compliant.
- Some nodes are created as malicicous based on probalitiy passed as p_graph.
- Generates an initial pool of valid transactions for the nodes to reach consensus on.
- Creates channels to propogate the transactions between the goroutines/nodes.

  # Compliant node:
  - Generates a set of initial transactions that it has to start propagating.Probability of assigning an initial transaction to each node is determined by p_txDistribution.
  - Generate a set of followees the node has to receive transactions from.Probability that an edge will exist is determined by p_graph.
  - Runs the simulation for set number of rounds determined by numNodes.
  - For each round,the nodes read transactions sent by the followees from the channel, check their validity aginst the initial pool and set the transactions in the channel for it's followers to read.
  - Any transactions that are not part of the pool are not written to the channel and the node is notified as malicious.
  
  # Compliant node:
  - Malicious node does all of the above and also genrate invalid transactions with it's own instance of the getInitialTrxArray().  



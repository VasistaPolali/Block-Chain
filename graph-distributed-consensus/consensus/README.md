# Distributed consensus algorithm within a p2p network of "trust" nodes.

This algorithm simulates a network that is a directed random graph, where each edge represents a trust relationship. For example, if there is an A → B edge, it means that Node B listens to transactions broadcast by node A. We say that B is A’s follower and A is B’s followee.

Each node should succeed in achieving consensus with a network in which its peers are other nodes running the same code.A network of nodes receiving different sets of transactions should agree on a set to be accepted.

Each node will be given its list of followees via an array whose indices correspond to nodes in the graph and a list of transactions (its proposal list) that it can broadcast to its followers.

In testing, the network may encounter a number (up to 45%) of malicious nodes that do not cooperate with the consensus algorithm. Malicious nodes may have arbitrary behavior like  broadcasting its own set of transactions, the network withstands  as many malicious nodes as possible and still achieve consensus.It also identifies and notifies about the malicious and transactions.

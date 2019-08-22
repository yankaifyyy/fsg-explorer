class Graph():
    def __init__(self):
        self.nodes = []
        self.edges = []

    def __init__(self, dic):
        self.nodes = []
        self.edges = []
        self.load(dic)

    def __len__(self):
        return len(self.nodes)

    def load(self, dic):
        for nd in dic['nodes']:
            self.nodes.append(nd)
        for e in dic['links']:
            self.edges.append(e)
        print(len(self))
        print(len(self.edges))


def searchSubgraph(graph, subgraph, tolerance):
    g = Graph(graph)
    sg = Graph(subgraph)

    return []

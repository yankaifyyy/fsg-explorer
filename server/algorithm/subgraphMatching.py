import networkx as nx
from collections import defaultdict

import sys

sys.path.append('..')


def transform(graph):
    g = nx.Graph()
    g.add_nodes_from(enumerate(graph['nodes']))
    g.add_edges_from(([l['source'], l['target']] for l in graph['links']))

    return g


def coeff(s1, s2):
    res = 0
    for k in s1:
        v = s1[k]
        v2 = s2[k]
        res += max(v - v2, 0)

    return res


class Matcher():
    def __init__(self):
        self.lcnt = defaultdict(int)

        self.nodeSet = set()

    def set(self, graph, subgraph, tolerance):
        self.g = transform(graph)
        self.sg = transform(subgraph)

        self.tol = tolerance

    def count_labels(self):
        self.lcnt = defaultdict(int)

        for _, lb in self.sg.nodes(data='label'):
            self.lcnt[lb] += 1

    def pick_nodes_and_edges(self):
        self.selected_nodes = [(d, lb) for d, lb in self.g.nodes(data='label') if self.lcnt[lb] > 0]
        self.node_set = set((d for d, _ in self.selected_nodes))
        self.selected_edges = [(self.g.node[u], self.g.node[v])
                               for (u, v) in self.g.edges()
                               if (u in self.node_set) and (v in self.node_set)]

        self.node_label_map = dict(self.selected_nodes)

    def e_finger(self, e):
        a, b = e[0]['label'], e[1]['label']

        if a < b:
            return (a, b)
        else:
            return (b, a)

    def dfs(self, d, seq):
        if self.got[d[1]] >= self.lcnt[d[1]]:
            return False

        self.got[d[1]] += 1
        self.visited[d[0]] = True
        seq.append(d[0])

        if len(seq) == len(self.sg):
            self.seqs.append(seq[:])
            seq.pop()
            self.got[d[1]] -= 1
            return True

        for u, v in self.selected_edges:
            eu = (u['index'], u['label'])
            ev = (v['index'], v['label'])
            if eu[0] == d[0] and (not self.visited[ev[0]]):
                self.dfs(ev, seq)
            elif ev[0] == d[0] and (not self.visited[eu[0]]):
                self.dfs(eu, seq)

        seq.pop()
        self.got[d[1]] -= 1
        return True

    def generate_candidates(self):
        self.count_labels()
        self.pick_nodes_and_edges()

        self.seqs = []

        for d in self.selected_nodes:
            self.visited = defaultdict(bool)
            self.got = defaultdict(int)
            self.dfs(d, [])

    def check_edges(self):
        sge = ((self.sg.node[u], self.sg.node[v])
               for (u, v) in self.sg.edges())
        pattern_fingers = list(map(self.e_finger, sge))

        ecnt = defaultdict(int)

        for pe in pattern_fingers:
            ecnt[pe] += 1

        target_score = self.sg.number_of_edges() * self.tol

        self.result = []

        for seq in self.seqs:
            st = set(seq)

            es = ((u, v) for u, v in self.selected_edges if (u['index'] in st) and (v['index'] in st))

            secnt = defaultdict(int)
            for e in es:
                ef = self.e_finger(e)
                secnt[ef] += 1

            score = coeff(ecnt, secnt)

            if score <= target_score:
                self.result.append(seq[:])

    def run(self):
        self.generate_candidates()

        self.check_edges()

    def get(self):
        return self.result


def search_subgraphs(graph, subgraph, tolerance):
    matcher = Matcher()

    matcher.set(graph, subgraph, tolerance)
    matcher.run()

    return matcher.get()

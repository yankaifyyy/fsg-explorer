from flask import Flask, jsonify
import pandas as pd
import os
import json

app = Flask(__name__)


@app.route('/api/listGraphs')
def list_graphs():
    return jsonify(os.listdir('./data'))


@app.route('/api/graph/<name>')
def get_graph(name):
    data_dir = f'./data/{name}'
    desc_param = {}
    graph_data = {}

    with open(f'{data_dir}/desc.txt') as df:
        for kv in (x.strip().split(':') for x in df):
            desc_param[kv[0]] = kv[1]
    graph_data['param'] = desc_param

    with open(f'{data_dir}/graph.json') as gf:
        graph_data['graph'] = json.load(gf)

    df = pd.read_csv(f'{data_dir}/features.csv')
    graph_data['features'] = df.drop(df.columns[0], axis=1).to_numpy().tolist()

    num_subgs = int(desc_param['subgraphs'])
    subgs = []
    for i in range(num_subgs):
        with open(f'{data_dir}/{i}.json') as f:
            subgs.append(json.load(f))
    graph_data['subgs'] = subgs

    return jsonify(graph_data)


if __name__ == '__main__':
    app.run(debug=True, port=9999)

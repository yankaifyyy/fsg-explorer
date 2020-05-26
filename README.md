# Frequent pattern based graph exploration system.

## Installation

1. Clone the code.
2. Run `pip install -r requirements.txt` in `server` folder.
3. Run `yarn install` in `client` folder.

## Data description

- Data stored in `server/data`.
- `graph.json`: The graph structure.
    - `nodes`: `[index, label, x, y]`, `x` and `y` are computed by any layout method.
    - `links`: `[index, source, target]`
- `0.json` - `n.json`: frequent subgraphs (extracted by GraMi, or any other frequent mining method).
    - `features`: A dictionary, key is the index in subgraph, value is the index in the original graph.
    - `edges`: `[[source_index, target_index]...]`
- `features.csv`: subgraph embedding feature vectors
- `desc.txt`
    - `dims`: The dimension of the embedding
    - `subgraphs`: The number of frequent subgraphs
- `graph.lg`: The original graph structure file used for GraMi

## Run

1. Run `python main.py` in `server` folder.
2. Run `yarn start` in `client` folder
3. Open browser, go to `http://localhost:3000`

## Test online
Try http://yankaifyyy.github.io/fsg-explorer for an online demo (Two datasets mentioned in the paper have been hosted online).

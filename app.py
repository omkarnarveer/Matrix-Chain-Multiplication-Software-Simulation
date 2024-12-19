from flask import Flask, render_template, request, jsonify
from matrix_chain import matrix_chain_order
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

def multiply_matrices(matrix_a, matrix_b):
    """Multiply two matrices and return the result."""
    return np.dot(matrix_a, matrix_b).tolist()

@app.route('/set-dimensions', methods=['POST'])
def set_dimensions():
    data = request.get_json()
    matrices_info = data.get("matrices")
    dimensions = [matrix["rows"] for matrix in matrices_info] + [matrices_info[-1]["cols"]]
    return jsonify({"dimensions": dimensions})

@app.route('/compute', methods=['POST'])
def compute():
    data = request.get_json()
    matrices = data.get("matrices")

    # Extract dimensions and matrices
    dimensions = [matrices[0]["rows"]] + [matrix["cols"] for matrix in matrices]
    matrix_values = [matrix["values"] for matrix in matrices]

    # Compute matrix chain order and steps
    m, s = matrix_chain_order(dimensions)
    final_result = compute_steps_with_steps(matrix_values, dimensions, s, 0, len(matrix_values) - 1)

    # Return final result
    return jsonify({
        "final_result": final_result
    })

def compute_steps_with_steps(matrices, dimensions, s, i, j):
    """Recursive function to compute multiplication with step tracking."""
    if i == j:
        return matrices[i]

    left = compute_steps_with_steps(matrices, dimensions, s, i, s[i][j])
    right = compute_steps_with_steps(matrices, dimensions, s, s[i][j] + 1, j)

    result = multiply_matrices(left, right)
    return result

if __name__ == '__main__':
    app.run(debug=True)
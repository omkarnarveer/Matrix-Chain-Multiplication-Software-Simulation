

def matrix_chain_order(dimensions):
    """Calculate optimal parenthesization order and costs."""
    n = len(dimensions) - 1
    m = [[0] * n for _ in range(n)]
    s = [[0] * n for _ in range(n)]

    for l in range(2, n + 1):
        for i in range(n - l + 1):
            j = i + l - 1
            m[i][j] = float('inf')
            for k in range(i, j):
                cost = m[i][k] + m[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]
                if cost < m[i][j]:
                    m[i][j] = cost
                    s[i][j] = k
    return m, s

def compute_steps(matrices, dimensions, s, i, j):
    """Recursive function to compute steps for matrix chain multiplication."""
    if i == j:
        return matrices[i]
    
    left = compute_steps(matrices, dimensions, s, i, s[i][j])
    right = compute_steps(matrices, dimensions, s, s[i][j] + 1, j)
    result = multiply_matrices(left, right)
    return result
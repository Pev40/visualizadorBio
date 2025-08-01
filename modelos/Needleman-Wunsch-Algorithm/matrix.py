import numpy as np


# Define a function to initialize the matrices used in the Needleman-Wunsch alignment algorithm
def initialize_matrices(rows, cols, gap_open, gap_extend):
    # Create three matrices filled with zeros. S for scoring alignments, Ix for horizontal gaps, Iy for vertical gaps.
    S = np.zeros((rows, cols), dtype=int)
    Ix = np.zeros((rows, cols), dtype=int)
    Iy = np.zeros((rows, cols), dtype=int)

    # Initialize the first column of Ix for gap penalties when skipping elements from the first sequence.
    for i in range(1, rows):
        Ix[i][0] = gap_open + gap_extend * i  # Gap penalty increases as you move down the rows

    # Initialize the first row of Iy for gap penalties when skipping elements from the second sequence.
    for j in range(1, cols):
        Iy[0][j] = gap_open + gap_extend * j  # Gap penalty increases as you move across the columns

    # Return the three initialized matrices
    return S, Ix, Iy

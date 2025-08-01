# Import necessary functions from alignment and file_manager modules
from alignment import needleman_wunsch, trace_back
from file_manager import read_files

# Set the directory where the input files are located
input_dir ='./INPUTS'



# Read the sequences from the files using the function from file_manager
sequences = read_files(input_dir)

# Loop through each pair of sequences read from the files
for seq1, seq2, filename in sequences:
    # Perform the Needleman-Wunsch alignment on the sequences and calculate the final score
    S, Ix, Iy, final_score = needleman_wunsch(seq1, seq2, match_score=7, mismatch_score=-5, gap_open=-3, gap_extend=-1)

    # Use the trace back function to find the best alignment between the two sequences
    alignment_a, alignment_b = trace_back(S, seq1, seq2, match_score=7, mismatch_score=-5, gap_extend=-1)

    # Print the filename, the alignment score, and the aligned sequences
    print(f"File: {filename}")
    print("Alignment Score:", final_score)
    print("Sequence 1:", alignment_a)
    print("Sequence 2:", alignment_b)
    print("")

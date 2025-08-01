import os

# Define a function to read DNA sequences from files in a given directory
def read_files(input_dir):
    # Create an empty list to store the sequences
    sequences = []
    # Loop through each file in the specified directory
    for filename in os.listdir(input_dir):
        # Check if the file has a '.seq' extension
        if filename.endswith('.seq'):
            # Open the file for reading
            with open(os.path.join(input_dir, filename), 'r') as file:
                # Read all lines from the file and remove newline characters
                lines = file.read().splitlines()
                # Ensure there are at least two lines (two sequences) in the file
                if len(lines) >= 2:
                    # Append the two sequences and the filename as a tuple to the list
                    sequences.append((lines[0], lines[1], filename))
    # Return the list of sequences
    return sequences

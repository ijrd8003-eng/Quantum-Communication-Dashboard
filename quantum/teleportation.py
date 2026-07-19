import os
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit 
from qiskit_aer import AerSimulator 
from qiskit.visualization import plot_histogram 

def create_teleportation(): 
    qc = QuantumCircuit(3, 3) 
    # State preparation of qubit 0
    qc.h(0) 
    # Create EPR pair on qubits 1 and 2
    qc.h(1) 
    qc.cx(1, 2) 
    # Alice's operations
    qc.cx(0, 1) 
    qc.h(0) 
    # Measure all to see correlation and results
    qc.measure([0, 1, 2], [0, 1, 2]) 
    return qc 

def run_teleportation(qc): 
    simulator = AerSimulator() 
    result = simulator.run(qc, shots=1024).result() 
    return result.get_counts() 

def save_histogram(counts):
    os.makedirs("static/outputs", exist_ok=True)
    fig = plot_histogram(counts)
    fig.savefig("static/outputs/teleportation_histogram.png", bbox_inches='tight')
    plt.close(fig)

def save_circuit(qc):
    os.makedirs("static/outputs", exist_ok=True)
    fig = qc.draw('mpl')
    fig.savefig("static/outputs/teleportation_circuit.png", bbox_inches='tight')
    plt.close(fig)
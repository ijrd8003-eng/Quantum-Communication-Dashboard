import os
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit 
from qiskit_aer import AerSimulator 
from qiskit.visualization import plot_histogram 

def create_entanglement():
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    return qc 

def run_entanglement(qc):
    simulator = AerSimulator() 
    result = simulator.run(qc, shots=1024).result()  
    return result.get_counts()

def save_histogram(counts):
    os.makedirs("static/outputs", exist_ok=True)
    fig = plot_histogram(counts)
    fig.savefig("static/outputs/entanglement_histogram.png", bbox_inches='tight')
    plt.close(fig)

def save_circuit(qc):
    os.makedirs("static/outputs", exist_ok=True)
    fig = qc.draw('mpl')
    fig.savefig("static/outputs/entanglement_circuit.png", bbox_inches='tight')
    plt.close(fig)
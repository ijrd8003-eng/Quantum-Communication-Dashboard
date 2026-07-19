# ⚛️ Quantum Communication Dashboard

An interactive web-based dashboard for simulating and visualizing fundamental quantum communication protocols using **Python**, **Flask**, and **IBM Qiskit 1.x**. The application performs local quantum simulations with **Qiskit Aer**, generating quantum circuit diagrams, measurement histograms, and live simulation results in real time.

---

## 🌟 Features

### Bell State Simulation

* Generate Bell state circuits using Qiskit.
* Simulate entangled qubits with the Aer Simulator.
* Display measurement counts and probability distributions.
* Visualize the generated quantum circuit and histogram.

### Quantum Entanglement

* Demonstrate quantum entanglement using Hadamard and CNOT gates.
* Observe correlated measurement outcomes.
* Visualize the complete quantum circuit.

### Quantum Teleportation

* Simulate the complete three-qubit quantum teleportation protocol.
* Demonstrate quantum state transfer using entanglement and classical communication.
* Display circuit diagrams and simulation results.

### Interactive Quantum Terminal

* View real-time backend logs.
* Display measurement counts and simulation status.
* Monitor simulation execution directly from the dashboard.

### Live Visualization

* Automatically generates quantum circuit diagrams.
* Displays measurement histograms after every simulation.
* Updates results instantly without reloading the page.

---

## 🚀 Technology Stack

* **Backend:** Python, Flask
* **Quantum Framework:** IBM Qiskit, Qiskit Aer
* **Visualization:** Matplotlib
* **Libraries:** NumPy, Pillow, NetworkX
* **Frontend:** HTML5, CSS3, JavaScript

---

## 📂 Project Structure

```text
Quantum-Communication-Dashboard/
├── app.py
├── requirements.txt
├── test_simulations.py
├── quantum/
│   ├── __init__.py
│   ├── bell_states.py
│   ├── entanglement.py
│   └── teleportation.py
├── static/
│   ├── script.js
│   ├── style.css
│   ├── images/
│   └── outputs/
└── templates/
    └── index.html
```

---

## ▶️ Running the Application

Start the Flask server:

```bash
python app.py
```

Open your browser and visit:

```text
http://127.0.0.1:5000/
```

---

## 🧪 Testing

Run the backend simulation tests:

```bash
python test_simulations.py
```

The test script validates all implemented quantum protocols and prints the corresponding measurement results in the terminal.

---

## ✨ Dashboard Highlights

* Interactive quantum communication simulations
* Bell State generation
* Quantum Entanglement visualization
* Quantum Teleportation simulation
* Live quantum circuit rendering
* Measurement histogram visualization
* Real-time backend terminal logs
* Responsive and modern user interface

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and extend it for educational and research purposes.

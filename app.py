import os
import matplotlib
matplotlib.use('Agg')  # Set backend before importing modules that might import pyplot
from flask import Flask, render_template, jsonify

from quantum.bell_states import create_bell, run_circuit as run_bell, save_histogram as save_bell_hist, save_circuit as save_bell_circuit
from quantum.entanglement import create_entanglement, run_entanglement, save_histogram as save_ent_hist, save_circuit as save_ent_circuit
from quantum.teleportation import create_teleportation, run_teleportation, save_histogram as save_tele_hist, save_circuit as save_tele_circuit

app = Flask(__name__)

# Ensure static outputs folder exists
os.makedirs("static/outputs", exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/simulate/<mode>")
def simulate(mode):
    try:
        if mode == "bell":
            qc = create_bell()
            counts = run_bell(qc)
            save_bell_hist(counts)
            save_bell_circuit(qc)
            return jsonify({
                "status": "success",
                "counts": counts,
                "circuit_url": "/static/outputs/bell_circuit.png",
                "histogram_url": "/static/outputs/bell_histogram.png"
            })
        elif mode == "entanglement":
            qc = create_entanglement()
            counts = run_entanglement(qc)
            save_ent_hist(counts)
            save_ent_circuit(qc)
            return jsonify({
                "status": "success",
                "counts": counts,
                "circuit_url": "/static/outputs/entanglement_circuit.png",
                "histogram_url": "/static/outputs/entanglement_histogram.png"
            })
        elif mode == "teleportation":
            qc = create_teleportation()
            counts = run_teleportation(qc)
            save_tele_hist(counts)
            save_tele_circuit(qc)
            return jsonify({
                "status": "success",
                "counts": counts,
                "circuit_url": "/static/outputs/teleportation_circuit.png",
                "histogram_url": "/static/outputs/teleportation_histogram.png"
            })
        else:
            return jsonify({"status": "error", "message": f"Unknown mode: {mode}"}), 400
    except Exception as e:
        import traceback
        error_msg = traceback.format_exc()
        print(error_msg)
        return jsonify({"status": "error", "message": str(e), "traceback": error_msg}), 500

if __name__ == "__main__":
    app.run(debug=True)
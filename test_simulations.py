import os
import sys

# Add the workspace root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing Bell States...")
    from quantum.bell_states import create_bell, run_circuit as run_bell, save_histogram as save_bell_hist, save_circuit as save_bell_circuit
    qc = create_bell()
    counts = run_bell(qc)
    print(f"Bell state counts: {counts}")
    save_bell_hist(counts)
    save_bell_circuit(qc)
    print("Bell State checks passed!")

    print("Testing Entanglement...")
    from quantum.entanglement import create_entanglement, run_entanglement, save_histogram as save_ent_hist, save_circuit as save_ent_circuit
    qc = create_entanglement()
    counts = run_entanglement(qc)
    print(f"Entanglement counts: {counts}")
    save_ent_hist(counts)
    save_ent_circuit(qc)
    print("Entanglement checks passed!")

    print("Testing Teleportation...")
    from quantum.teleportation import create_teleportation, run_teleportation, save_histogram as save_tele_hist, save_circuit as save_tele_circuit
    qc = create_teleportation()
    counts = run_teleportation(qc)
    print(f"Teleportation counts: {counts}")
    save_tele_hist(counts)
    save_tele_circuit(qc)
    print("Teleportation checks passed!")

    print("All backend simulation scripts verified successfully!")
except Exception as e:
    import traceback
    traceback.print_exc()
    sys.exit(1)

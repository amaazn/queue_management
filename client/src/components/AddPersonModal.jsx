import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal.jsx";
import Spinner from "./Spinner.jsx";
import { addToken } from "../services/tokenService.js";

export default function AddPersonModal({ open, onClose, queueId, onAdded }) {
  const [personName, setPersonName] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (loading) return;
    setPersonName("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personName.trim()) {
      toast.error("Person name is required");
      return;
    }
    setLoading(true);
    try {
      const data = await addToken(queueId, personName.trim());
      toast.success(`Token #${data.token.tokenNumber} added for ${data.token.personName}`);
      setPersonName("");
      onAdded?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add person");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Add a person to the queue">
      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="person-name">
          Person name
        </label>
        <input
          id="person-name"
          className="input"
          placeholder="e.g. Rahul"
          value={personName}
          onChange={(e) => setPersonName(e.target.value)}
          autoFocus
        />
        <p className="mt-2 text-xs text-slate-400">
          A token number is generated automatically.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn-secondary"
            onClick={close}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Spinner size={16} className="text-white" /> : "Add Person"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

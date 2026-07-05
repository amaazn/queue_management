import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal.jsx";
import Spinner from "./Spinner.jsx";
import { createQueue } from "../services/queueService.js";

export default function AddQueueModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (loading) return;
    setName("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Queue name is required");
      return;
    }
    setLoading(true);
    try {
      const data = await createQueue(name.trim());
      toast.success("Queue created");
      setName("");
      onCreated?.(data.queue);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create queue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Create a new queue">
      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="queue-name">
          Queue name
        </label>
        <input
          id="queue-name"
          className="input"
          placeholder="e.g. Hospital OPD, Bank Counter"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
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
            {loading ? <Spinner size={16} className="text-white" /> : "Create Queue"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

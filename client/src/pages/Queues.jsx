import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiLayers } from "react-icons/fi";
import QueueCard from "../components/QueueCard.jsx";
import AddQueueModal from "../components/AddQueueModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { LoadingScreen } from "../components/Spinner.jsx";
import { getQueues, deleteQueue } from "../services/queueService.js";

export default function Queues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const data = await getQueues();
      setQueues(data.queues);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load queues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteQueue(toDelete._id);
      toast.success(`"${toDelete.name}" deleted`);
      setQueues((prev) => prev.filter((q) => q._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete queue");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Queues</h2>
          <p className="text-sm text-slate-500">
            Create and manage your service queues.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <FiPlus className="h-4 w-4" />
          Create Queue
        </button>
      </div>

      {loading ? (
        <LoadingScreen label="Loading queues..." />
      ) : queues.length === 0 ? (
        <EmptyState
          icon={FiLayers}
          title="No queues yet"
          description="Create your first queue — like Hospital OPD or Bank Counter — to start issuing tokens."
          action={
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              <FiPlus className="h-4 w-4" />
              Create Queue
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {queues.map((queue, i) => (
              <QueueCard
                key={queue._id}
                queue={queue}
                index={i}
                onDelete={setToDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddQueueModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={load}
      />
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete queue?"
        message={`This will permanently delete "${toDelete?.name}" and all of its tokens. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

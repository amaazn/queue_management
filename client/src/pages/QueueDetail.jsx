import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiPlus,
  FiPlayCircle,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import TokenRow from "../components/TokenRow.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import AddPersonModal from "../components/AddPersonModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { LoadingScreen } from "../components/Spinner.jsx";
import { formatDateTime } from "../utils/formatDate.js";
import {
  getTokens,
  moveTokenUp,
  moveTokenDown,
  serveNext,
  cancelToken,
} from "../services/tokenService.js";

export default function QueueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showAddPerson, setShowAddPerson] = useState(false);
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getTokens(id);
      setData(res);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load queue");
      if (err.response?.status === 404) navigate("/queues");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (fn, successMsg) => {
    setActionLoading(true);
    try {
      const result = await fn();
      if (successMsg) toast.success(successMsg(result));
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleServeNext = () =>
    runAction(
      () => serveNext(id),
      (r) => `Served ${r.token.personName} (Token #${r.token.tokenNumber})`
    );

  const handleUp = (tokenId) => runAction(() => moveTokenUp(tokenId));
  const handleDown = (tokenId) => runAction(() => moveTokenDown(tokenId));

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelToken(toCancel._id);
      toast.success(`Token #${toCancel.tokenNumber} cancelled`);
      setToCancel(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel token");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingScreen label="Loading queue..." />;
  if (!data) return null;

  const { queue, waiting, history } = data;

  return (
    <div className="space-y-6">

      <div>
        <button
          onClick={() => navigate("/queues")}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to queues
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{queue.name}</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
              <FiUsers className="h-4 w-4" />
              <span className="font-semibold text-slate-700">
                {waiting.length}
              </span>
              waiting in line
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="btn-secondary"
              onClick={() => setShowAddPerson(true)}
            >
              <FiPlus className="h-4 w-4" />
              Add Person
            </button>
            <button
              className="btn-primary"
              onClick={handleServeNext}
              disabled={actionLoading || waiting.length === 0}
            >
              <FiPlayCircle className="h-4 w-4" />
              Serve Next
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Waiting Line</h3>
          <span className="text-xs text-slate-400">
            Lowest position is served next
          </span>
        </div>

        {waiting.length === 0 ? (
          <EmptyState
            icon={FiClock}
            title="The line is empty"
            description="Add a person to generate their token and place them in the queue."
            action={
              <button
                className="btn-primary"
                onClick={() => setShowAddPerson(true)}
              >
                <FiPlus className="h-4 w-4" />
                Add Person
              </button>
            }
          />
        ) : (
          <motion.div layout className="space-y-2">
            <AnimatePresence>
              {waiting.map((token, i) => (
                <motion.div
                  key={token._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                >
                  <TokenRow
                    token={token}
                    isFirst={i === 0}
                    isLast={i === waiting.length - 1}
                    busy={actionLoading}
                    onUp={() => handleUp(token._id)}
                    onDown={() => handleDown(token._id)}
                    onCancel={() => setToCancel(token)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {history.length > 0 && (
        <div className="card p-5">
          <h3 className="mb-4 font-semibold text-slate-800">History</h3>
          <div className="space-y-2">
            {history.map((token) => (
              <div
                key={token._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {token.personName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Token #{token.tokenNumber} ·{" "}
                    {formatDateTime(token.servedAt || token.cancelledAt)}
                  </p>
                </div>
                <StatusBadge status={token.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <AddPersonModal
        open={showAddPerson}
        onClose={() => setShowAddPerson(false)}
        queueId={id}
        onAdded={load}
      />
      <ConfirmDialog
        open={!!toCancel}
        onClose={() => setToCancel(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel token?"
        message={`Cancel Token #${toCancel?.tokenNumber} for ${toCancel?.personName}? They will be removed from the waiting line.`}
        confirmLabel="Cancel Token"
      />
    </div>
  );
}

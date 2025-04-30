import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const FaqModal = ({ initialData, onClose, onSubmit, loading }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || '');
      setAnswer(initialData.answer || '');
      setStatus(initialData.status || 'active');
    } else {
      // Reset form for adding
      setQuestion('');
      setAnswer('');
      setStatus('active');
    }
    setError(''); // Clear error when modal opens or data changes
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!question.trim() || !answer.trim()) {
      setError('Both question and answer are required.');
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      status
    };

    if (initialData?.id) {
      // Add id for update mutation
      onSubmit({ id: initialData.id, ...payload });
    } else {
      // Submit for create mutation
      onSubmit(payload);
    }
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white p-8 rounded-2xl shadow-3xl w-full max-w-lg border-t-8 border-primary-500 animate-fadeIn">
                {/* Close Button */}
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-full w-10 h-10 flex items-center justify-center shadow transition-all"
                  onClick={onClose}
                  aria-label="Close"
                  disabled={loading}
                >
                  <span className="text-2xl font-bold">&times;</span>
                </button>
                <Dialog.Title className="text-3xl font-extrabold mb-6 text-primary-700 text-center tracking-tight">
                  {initialData ? 'Edit FAQ' : 'Add New FAQ'}
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="mb-5">
                    <label htmlFor="faqQuestion" className="block mb-2 text-sm font-semibold text-gray-700">
                      Question
                    </label>
                    <input
                      type="text"
                      id="faqQuestion"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter FAQ question"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="faqAnswer" className="block mb-2 text-sm font-semibold text-gray-700">
                      Answer
                    </label>
                    <textarea
                      id="faqAnswer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter FAQ answer"
                      rows={4}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="faqStatus" className="block mb-2 text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      id="faqStatus"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none bg-white"
                      disabled={loading}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="rounded-lg px-5 py-2 font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg px-5 py-2 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : (initialData ? 'Update FAQ' : 'Add FAQ')}
                    </button>
                  </div>
                </form>
                <style jsx>{`
                  .animate-fadeIn {
                    animation: fadeIn 0.3s ease;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                  }
                `}</style>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default FaqModal;
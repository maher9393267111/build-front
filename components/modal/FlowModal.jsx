import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function FlowModal({ onClose, onSubmit, optionId, questions, flow }) {
  const [formData, setFormData] = useState({
    nextQuestionId: '',
    isTerminal: false
  });

  // Initialize form with flow data if editing
  useEffect(() => {
    if (flow) {
      setFormData({
        nextQuestionId: flow.nextQuestionId || '',
        isTerminal: flow.isTerminal || false
      });
    } else {
      setFormData({
        nextQuestionId: '',
        isTerminal: false
      });
    }
  }, [flow]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert empty string to null for nextQuestionId if isTerminal is true
    const payload = {
      ...formData,
      nextQuestionId: formData.isTerminal ? null : formData.nextQuestionId || null
    };
    
    onSubmit(payload);
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center transition-all">
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
              >
                <span className="text-2xl font-bold">&times;</span>
              </button>
              <Dialog.Title as="h3" className="text-3xl font-extrabold mb-6 text-primary-700 text-center tracking-tight">
                Set Next Question
              </Dialog.Title>
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      name="isTerminal"
                      checked={formData.isTerminal}
                      onChange={handleChange}
                      className="mr-2 accent-primary-500"
                    />
                    <span>This is a terminal option (no next question)</span>
                  </label>
                </div>
                {!formData.isTerminal && (
                  <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Next Question</label>
                    <select
                      name="nextQuestionId"
                      value={formData.nextQuestionId}
                      onChange={handleChange}
                      className="input input-bordered w-full rounded-lg border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                      required={!formData.isTerminal}
                    >
                      <option value="">Select next question</option>
                      {questions.map(question => (
                        <option key={question.id} value={question.id}>
                          {question.questionText}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded-lg px-5 py-2 font-semibold bg-primary-100 text-primary-700 hover:bg-primary-200 transition-all"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-5 py-2 font-semibold bg-primary-500 text-white hover:bg-primary-600 transition-all shadow"
                  >
                    Save Flow
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
      </Dialog>
    </Transition>
  );
} 
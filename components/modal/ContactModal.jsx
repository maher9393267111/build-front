import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const ContactModal = ({ initialData, onClose, onSubmit, loading, isOpen = false }) => {
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('new');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject || '');
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setMessage(initialData.message || '');
      setStatus(initialData.status || 'new');
      setNote(initialData.note || '');
    } else {
      // Reset form for adding
      setSubject('');
      setName('');
      setEmail('');
      setMessage('');
      setStatus('new');
      setNote('');
    }
    setError(''); // Clear error when modal opens or data changes
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!subject.trim() || !name.trim() || !email.trim() || !message.trim()) {
      setError('Subject, name, email, and message are required.');
      return;
    }

    const payload = {
      subject: subject.trim(),
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      status,
      note: note.trim()
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
    <Transition appear show={isOpen} as={Fragment}>
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
                  {initialData ? 'Edit Contact' : 'Add New Contact'}
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="mb-5">
                    <label htmlFor="contactSubject" className="block mb-2 text-sm font-semibold text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="contactSubject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter subject"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="contactName" className="block mb-2 text-sm font-semibold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter name"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="contactEmail" className="block mb-2 text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter email"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="contactMessage" className="block mb-2 text-sm font-semibold text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="contactMessage"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter message"
                      rows={4}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-5">
                    <label htmlFor="contactStatus" className="block mb-2 text-sm font-semibold text-gray-700">
                      Status
                    </label>
                    <select
                      id="contactStatus"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none bg-white"
                      disabled={loading}
                    >
                      <option value="new">New</option>
                      <option value="processing">Processing</option>
                      <option value="achieved">Achieved</option>
                    </select>
                  </div>
                  <div className="mb-5">
                    <label htmlFor="contactNote" className="block mb-2 text-sm font-semibold text-gray-700">
                      Admin Note
                    </label>
                    <textarea
                      id="contactNote"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all px-3 py-2 outline-none"
                      placeholder="Enter admin note"
                      rows={3}
                      disabled={loading}
                    />
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
                      {loading ? 'Saving...' : (initialData ? 'Update Contact' : 'Add Contact')}
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

export default ContactModal; 
export const revalidate = 10;

import { cookies } from 'next/headers';
import { getAdminFaqs } from '@services/api';
import AdminFaqsMain from './AdminFaqMain';

export const metadata = {
  title: 'Admin - FAQ Management',
}

export default async function AdminFaqsPage() {
  // Fetch FAQs server-side
  let faqs = [];
  const token = cookies().get('token')?.value;
  try {
    faqs = await getAdminFaqs(token);
  } catch (e) {
    // handle error or leave faqs as empty array
  }
  console.log(faqs);

  return <AdminFaqsMain initialFaqs={faqs} />;
}
// 'use client';
// import { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { getAdminFaqs, createFaq, updateFaq, deleteFaq } from '@services/api';
// import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
// import FaqModal from '@components/modal/FaqModal';
// import ConfirmationModal from '@components/modal/ConfirmationModal';

// const AdminFaqsPage = () => {
//   const queryClient = useQueryClient();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editFaq, setEditFaq] = useState(null);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [faqToDelete, setFaqToDelete] = useState(null);

//   const { data: faqs, isLoading } = useQuery('adminFaqs', getAdminFaqs);

//   const addMutation = useMutation(createFaq, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('adminFaqs');
//       setModalOpen(false);
//     }
//   });

//   const updateMutation = useMutation(updateFaq, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('adminFaqs');
//       setModalOpen(false);
//       setEditFaq(null);
//     }
//   });

//   const deleteMutation = useMutation(deleteFaq, {
//     onSuccess: () => {
//       queryClient.invalidateQueries('adminFaqs');
//       setConfirmOpen(false);
//       setFaqToDelete(null);
//     }
//   });

//   const handleEdit = (faq) => {
//     setEditFaq(faq);
//     setModalOpen(true);
//   };

//   const handleAdd = () => {
//     setEditFaq(null);
//     setModalOpen(true);
//   };

//   const handleDelete = (faq) => {
//     setFaqToDelete(faq);
//     setConfirmOpen(true);
//   };

//   const confirmDelete = () => {
//     if (faqToDelete) {
//       deleteMutation.mutate(faqToDelete.id);
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center mb-4 px-6 py-4 rounded-lg shadow bg-gradient-to-r from-primary-700 to-primary-500">
//         <h2 className="text-xl font-bold text-white drop-shadow">FAQ Management</h2>
//         <button
//           className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white font-semibold rounded shadow-lg hover:from-primary-700 hover:to-primary-900 transition"
//           onClick={handleAdd}
//         >
//           + Add FAQ
//         </button>
//       </div>
//       <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Question</th>
//               <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Answer</th>
//               <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-100">
//             {isLoading ? (
//               <tr>
//                 <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td>
//               </tr>
//             ) : (
//               faqs?.map((faq, idx) => (
//                 <tr
//                   key={faq.id}
//                   className={
//                     (idx % 2 === 0 ? "bg-gray-50" : "bg-white") +
//                     " hover:bg-blue-50 transition"
//                   }
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap font-medium">{faq.question}</td>
//                   <td className="px-6 py-4">{faq.answer}</td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
//                       ${faq.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {faq.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 flex gap-2">
//                     <button
//                       className="flex items-center gap-1 px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-yellow-300"
//                       onClick={() => handleEdit(faq)}
//                       title="Edit"
//                     >
//                       <PencilSquareIcon className="h-5 w-5" />
//                       <span className="hidden sm:inline">Edit</span>
//                     </button>
//                     <button
//                       className="flex items-center gap-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition focus:outline-none focus:ring-2 focus:ring-red-300"
//                       onClick={() => handleDelete(faq)}
//                       title="Delete"
//                     >
//                       <TrashIcon className="h-5 w-5" />
//                       <span className="hidden sm:inline">
//                         {deleteMutation.isLoading && faqToDelete?.id === faq.id ? 'Deleting...' : 'Delete'}
//                       </span>
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//             {!isLoading && faqs?.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No FAQs found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="sm:hidden text-xs text-gray-500 mt-2">Scroll right to see more &rarr;</div>
      
//       {/* Modals */}
//       {modalOpen && (
//         <FaqModal
//           initialData={editFaq}
//           onClose={() => { setModalOpen(false); setEditFaq(null); }}
//           onSubmit={editFaq ? updateMutation.mutate : addMutation.mutate}
//           loading={addMutation.isLoading || updateMutation.isLoading}
//         />
//       )}
//       {confirmOpen && (
//         <ConfirmationModal
//           open={confirmOpen}
//           onClose={() => {setConfirmOpen(false); setFaqToDelete(null);}}
//           onConfirm={confirmDelete}
//           title="Delete FAQ"
//           description={`Are you sure you want to delete the FAQ "${faqToDelete?.question}"? This action cannot be undone.`}
//           loading={deleteMutation.isLoading}
//         />
//       )}
//     </>
//   );
// };

// export default AdminFaqsPage;